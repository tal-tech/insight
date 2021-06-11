import { hashCode, cookie, throttle, getSignBySignStr } from './util';

import { EventInfo, MetaInfo, EventTypeInfo, EventPageCreateInfo, PlatformInfo } from './interface';
import { getClickInfo, dispatchCustomEvent, bindEventListener, getLines } from './event';
import Expose from './expose';

const USER_ID = '_xhb_uid';
const CLIENT_ID = '_xhb_cid';
const EVENTS_LEN = 5;
const MAX_EVENTS_LEN = 50;

export type EnvType = 'local' | 'dev' | 'test' | 'pre' | 'prod';
export interface ConfigInfo {
  isDebug?: boolean; // 默认为false
  appId: MetaInfo['appId'];
  projectId?: MetaInfo['projectId']; // 项目可以后面再初始化
  axios?: any; // 一般是项目的axios
  wxCurl?: any; // 一般是wx项目的request
  env?: EnvType;
  platform?: PlatformInfo;
}
export interface SendInfo {
  params?: EventInfo['params'];
  elementKey?: EventInfo['elementKey'];
  manualKey?: EventInfo['manualKey'];
  desc?: EventInfo['desc'];
  typeInfo?: EventTypeInfo;
}

export interface PageInfo {
  createTime: number; // 页面的创建的时间
  starHideTime: number; // 页面开始掩藏的时间
  href: string; // 页面的原始url
  pageId: number; //
  pageUrl: string; // 去除域名的url
  pageTitle: string; //
}

export interface XpInfo {
  projectId: MetaInfo['projectId']; // 项目可以后面再初始化
  xpCurl: any; // 晓程序项目独有的xp
  env: EnvType;
  role: MetaInfo['role'];
  appVersion: string; //
}

export interface UserInfo {
  userId: string;
  token: string;
  role: string;
}

const traceObj = {
  dev: '',
  test: '',
  pre: '',
  prod: ''
};

// const ApiUrl = "/api/trace/frontend/event"
// const BeaconApiUrl = "/api/trace/frontend/app/close"
// 不能加上api, 因为trace服务是单独部署的
const ApiUrl = '/trace/frontend/event';
const BeaconApiUrl = '/trace/frontend/app/close';
export class Monitor {
  // app配置信息
  metaInfo: MetaInfo;
  user: UserInfo;

  env: EnvType;
  isDebug: boolean = false;

  axios: any;
  wxCurl: any;
  xpCurl: any;

  // app创建时间
  appCreateTime = Date.now();

  // 当前页面的状态
  page: PageInfo;

  // events
  events: EventInfo[] = [];

  // 用于获取签名自负串
  genSign: (url: string, data: any, method: string) => string;

  constructor(config: ConfigInfo) {
    if (!config || !config.appId) {
      throw new Error('埋点需传入appId');
    }

    // 初始化配置信息
    // 初始化用户信息
    const userId = cookie.read(USER_ID),
      clientId = cookie.read(CLIENT_ID) || cookie.set(CLIENT_ID);
    this.metaInfo = {
      appId: config.appId,
      projectId: config.projectId,
      userId: userId || '',
      clientId: clientId,

      platform: config.platform || 'web',
      role: 'unknown',
      appVersion: ''
    };

    this.isDebug = config.isDebug || !!localStorage.getItem('trace-debug');
    this.env = config.env;

    this.axios = config.axios;
    this.wxCurl = config.wxCurl;

    // // 设置当前页面的状态
    // this.setPage();

    // // 初始化监听信息
    // this.proxyEvent();
    // this.addListenerClick();
    // 接入曝光 监听
    this.addExpose();
    window._trace = this.trace;
  }

  // 曝光调用
  private addExpose() {
    const expose = new Expose();
    document.body.addEventListener('dataExpose', (e: Event) => {
      const result = getClickInfo(e as MouseEvent, 'expose');
      this.send({
        elementKey: result.elementKey,
        desc: '曝光',
        typeInfo: {
          type: 'elementShow'
        }
      });
    });
    expose.publish();
  }

  /**
   * 专门针对晓程序的埋点
   */
  public setXpInfo(xpInfo: XpInfo) {
    const { projectId, env, xpCurl, role, appVersion } = xpInfo;
    this.env = env;
    this.xpCurl = xpCurl;
    this.metaInfo.projectId = projectId;
    this.metaInfo.role = role;
    this.metaInfo.appVersion = appVersion;
    this.metaInfo.platform = 'xhb_mini_programs';
  }

  public setUser(user: UserInfo) {
    if (!user) return;
    cookie.set(USER_ID, user.userId);
    this.metaInfo.userId = user.userId;
    this.user = user;
  }

  public setSignFun(genSign) {
    this.genSign = genSign;
  }

  private getBaseUrl() {
    const url = traceObj[this.env] || traceObj.prod;
    return location.protocol.match(/http/) ? location.protocol + url : 'https:' + url;
  }

  private setPage() {
    this.page = {
      createTime: Date.now(),
      ...this.getPageInfo(),
      starHideTime: -1
    };
  }

  private getPageInfo() {
    return {
      // pageId = projectId + pathname + hash => 生成hash number
      pageId: this.getPageId(),
      href: location.href,
      pageUrl: this.getPageUrl(),
      pageTitle: document.title
    };
  }

  private getPageId() {
    const hash = location.hash.match(/(\S+)\?/);
    return hashCode(this.metaInfo.projectId + location.pathname + (hash ? hash[1] : location.hash));
  }

  private getPageUrl() {
    if (location.href.match(/^http/)) {
      const hash = location.hash.match(/(\S+)\?/);
      location.pathname + (hash ? hash[1] : location.hash);
    }
    // 如果是file协议
    return '/' + location.hash;
  }

  private proxyEvent() {
    window.addEventListener(
      'hashchange',
      function () {
        dispatchCustomEvent.call(this, 'routerHashChange');
      },
      false
    );
    history.pushState = bindEventListener('pushState');
    history.replaceState = bindEventListener('replaceState');
  }

  public eventHandle = {
    click: (e) => {
      const result = getClickInfo(e);
      this.send({
        elementKey: result.elementKey,
        desc: result.desc,
        typeInfo: {
          type: 'click',
          data: result.data
        }
      });
    },
    /**
     * 路由切换，会触发页面pageCreate|pageClose事件
     */
    pageCreateClose: (e) => {
      const now = Date.now();

      // 上一页的信息
      const prvPage: EventPageCreateInfo = {
        prvPageId: this.page.pageId,
        prvPageUrl: this.page.pageUrl, //  上一个页面的url
        prvPageTitle: this.page.pageTitle, //  上一个页面的title
        prvHref: this.page.href
      };
      const prvCreateTime = this.page.createTime;
      // 设置当前页面的信息
      this.setPage();

      const pageCreate: EventInfo = {
        desc: this.page.pageTitle + '页面创建事件',
        ...this.getPageInfo(),
        typeInfo: {
          type: 'pageCreate',
          data: {
            ...prvPage
          }
        }
      };

      const pageClose: EventInfo = {
        desc: prvPage.prvPageTitle + '页面关闭事件',
        pageId: prvPage.prvPageId,
        pageUrl: prvPage.prvPageUrl,
        pageTitle: prvPage.prvPageTitle,
        href: prvPage.prvHref,
        typeInfo: {
          type: 'pageClose',
          data: {
            stayTime: now - prvCreateTime
          }
        }
      };

      this.addEvents([pageClose, pageCreate]);
    },
    pageHideActive: (e) => {
      const now = Date.now();
      if (document.hidden) {
        this.page.starHideTime = now;
        this.send({
          desc: this.page.pageTitle + '页面隐藏事件',
          typeInfo: {
            type: 'pageHide',
            data: {
              showTime: now - this.page.createTime
            }
          }
        });
      } else {
        this.send({
          desc: this.page.pageTitle + '页面激活事件',
          typeInfo: {
            type: 'pageActive',
            data: {
              hideTime: now - this.page.starHideTime
            }
          }
        });
      }
    },
    appClose: (e) => {
      // 这个事件比较特殊，需要通过sendBeacon来发送
      this.send({
        desc: this.metaInfo.projectId + '应用/关闭',
        typeInfo: {
          type: 'appClose',
          data: {
            stayTime: Date.now() - this.appCreateTime
          }
        }
      });
    },
    error: (event) => {
      console.log('发现jsError', event);
      if (!event) return;
      const log = {
        kind: 'stability', // 监控指标大类
        errorType: 'jsError', // js执行错误
        url: '',
        message: event.message,
        filename: event.filename,
        position: `${event.lineno}:${event.colno}`, // 行列位置
        stack: getLines(event.error?.stack)
      };
      this.send({
        desc: this.metaInfo.projectId + '应用/error',
        typeInfo: {
          type: 'error',
          data: {
            ...log
          }
        }
      });
    },
    fetchError: (event) => {
      console.log('发现js资源加载Error', event);
      if (!event) return;
      this.send({
        desc: this.metaInfo.projectId + '应用/fetchError',
        typeInfo: {
          type: 'fetchError',
          data: {
            message: event.message,
            error: event.error,
            url: event.target?.src || event.target?.href
          }
        }
      });
    },
    elementError: (event) => {
      if (!event) return;
      this.send({
        desc: this.metaInfo.projectId + '应用/elementError',
        typeInfo: {
          type: 'elementError',
          data: {
            message: event.message,
            error: event.error,
            url: event.target?.src || event.target?.href
          }
        }
      });
    }
  };

  /**
   * 监听页面的各种事件
   */
  private addListenerClick() {
    // window.onbeforeunload = this.eventHandle.appClose
    window.addEventListener('unload', this.eventHandle.appClose, false);

    // 监听页面click
    window.addEventListener('click', this.eventHandle.click, false);

    // 监听 pageCreate 和 pageClose
    window.addEventListener('routerHashChange', this.eventHandle.pageCreateClose);
    window.addEventListener('replaceState', this.eventHandle.pageCreateClose);
    window.addEventListener('pushState', this.eventHandle.pageCreateClose);

    // 监听 pageHide 和 pageActive
    window.addEventListener('visibilitychange', this.eventHandle.pageHideActive, false);

    window.addEventListener('error', (event) => {
      // js资源加载error
      // @ts-ignore
      if (event.target?.src || event.target?.href) {
        this.eventHandle.fetchError(event);
      } else {
        // js执行error
        this.eventHandle.error(event);
      }
    });

    // 未捕获的异常，可以拿到promise中错误
    window.addEventListener('unhandledrejection', (event) => {
      // let message: string;
      // let filename: string;
      // let lineno = 0;
      // let colno = 0;
      // let stack = '';
      // let reason = event.reason;
      // if (typeof reason === 'string') {
      //   message = event.reason;
      // } else if (typeof reason === 'object') {
      //   if (reason.stack) {
      //     let matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/);
      //     filename = matchResult[1];
      //     lineno = matchResult[2];
      //     colno = matchResult[3]
      //   }
      //   message = reason.message;
      //   stack = getLines(reason.stack || '');
      // }
      // const log = {
      //   kind: 'stability', // 监控指标大类
      //   errorType: 'promiseError',
      //   message,
      //   filename,
      //   position: `${lineno}:${colno}`,
      //   stack
      // }
      // this.send({
      //   elementKey: -1,
      //   desc: this.metaInfo.projectId + "应用/error",
      //   typeInfo: {
      //     type: "error",
      //     data: {
      //      ...log
      //     }
      //   },
      // });
    });
  }

  /**
   * 暴露外部 发送数据方式
   * @param data
   * @param isAuto
   */
  public trace = (data: SendInfo) => {
    if (!data.typeInfo) {
      data.typeInfo = {
        type: 'emit'
      };
    }

    this.send(data, false);
  };

  /**
   * 内部 发送数据方式，主要用于不需要额外设置当前page的事件类型，比如click、pageHide、pageActive，app事件，异常事件
   * @param data
   * @param isAuto
   */
  private send(data: SendInfo, isAuto: boolean = true) {
    // @ts-ignore
    const eventInfo: EventInfo = {
      ...data,
      ...this.getPageInfo(),
      eventTime: Date.now(),
      isAuto
    };

    this.addEvents([eventInfo], isAuto);
  }

  /**
   * 把数据存储到events内
   * @param data
   * @param isAuto
   */
  private addEvents(data: EventInfo[], isAuto: boolean = true) {
    let sendBeacon = false;
    // 按照规范对数据进行预处理
    data.forEach((k) => {
      if (this.isDebug) {
        console.log('trace:type', k.typeInfo.type);
        console.log('trace:data', k);
      }
      if (k.typeInfo.type === 'appClose') {
        sendBeacon = true;
      }

      const params = k.params || '';
      k.elementKey = k.elementKey || -1;
      k.manualKey = '' + (k.manualKey || -1);
      k.eventTime = Date.now();
      k.isAuto = isAuto;
      k.desc = k.desc ?? '';
      k.params = typeof params === 'string' ? params : JSON.stringify(k.params);
      k.typeInfo.data = k.typeInfo.data || {};
      this.events.push(k);
    });

    // 如果检测到appClose事件，会直接调用sendBeacon发送数据
    if (sendBeacon) {
      this.sendBeacon();
    } else if (this.events.length >= EVENTS_LEN) {
      this.postData();
    } else {
      this.throttlePost();
    }
  }

  private getPostData() {
    return {
      ...this.metaInfo,
      role: (this.metaInfo.role || '').toLocaleLowerCase(),
      eventInfos: this.events.slice(0, MAX_EVENTS_LEN) // 最多50条数据
    };
  }

  private throttlePost = throttle(this.postData, 1000);

  private async postData() {
    if (this.events.length === 0) {
      return;
    }

    const postData = this.getPostData();
    // 提前清空，防止频繁调用导致events一直在push
    this.events = [];
    try {
      if (this.xpCurl) {
        // 哓程序内
        await this.xpCurl.postAsync(this.getBaseUrl() + ApiUrl, postData);
      } else if (this.axios) {
        // web内
        this.axios.defaults.baseURL = this.getBaseUrl();
        await this.axios.post(ApiUrl, postData);
      } else {
        // 微信小程序
      }
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * 专门用于发送appClose事件
   * @param data
   */
  private sendBeacon() {
    if (!navigator.sendBeacon) {
      return this.postData();
    }
    const postData = this.getPostData();

    const headers = {
      type: 'application/json'
      // TODO：以下代码其实没有效果，因为目前beacon还不支持自定义头部内容 https://stackoverflow.com/questions/40523469/navigator-sendbeacon-to-pass-header-information
      // Authorization: `Bearer ${this.user.token}`.trim(),
      // 'x-User-Id': this.user.userId,
      // 'X-Content-Security': this.genSign(BeaconApiUrl, postData, 'post')
    };
    const blob = new Blob([JSON.stringify(postData)], headers);
    const sign = getSignBySignStr(this.genSign(BeaconApiUrl, postData, 'post'));
    navigator.sendBeacon(this.getBaseUrl() + BeaconApiUrl + '?sign=' + JSON.stringify(sign), blob);
  }
}
export default Monitor;
