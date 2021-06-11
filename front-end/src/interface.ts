
// 安卓/ios/flutter/electron/web/微信小程序/晓黑板晓程序
export type PlatformInfo =
  | 'android'
  | 'iOS'
  | 'flutter'
  | 'electron'
  | 'web'
  | 'wx_mini_programs'
  | 'xhb_mini_programs';

// 这是一次埋点的元数据，它和业务无关（A类指标）
export interface MetaInfo {
  appVersion: string; // 版本
  appId: 1 | 2 | 3 | 4; 
  projectId: string; // 项目id 后端自动生成
  platform: PlatformInfo;
  clientId: string; // 客户端生成的标识符，主要用于统计不区分是否登录的业务场景
  userId: string; //
  role: 'student' | 'teacher' | 'parent' | 'unknown';
}

// 用户行为事件的所有 （主要点）
export interface InsertInfo extends MetaInfo {
  eventInfos: EventInfo[];
}

// 一次行为事件的信息，所有不带？的都可以自动化生成或者自动获取（B类指标）
export interface EventInfo {
  isAuto?: boolean; // 是否自动埋点, 如果手动调用为false
  params?: any; // 自定义数据，一般是业务数据（C类指标）
  manualKey?: string | number; // 这是手动埋点的数据 , 如果是自动埋点则为-1

  desc: string; // 这次事件的详细描述, 一般为 【pageTile/元素的content】

  elementKey?: number; // 【自动生成】元素key ,在某些事件中，它可以没有
  typeInfo: EventTypeInfo;

  href: string; // 页面的完整url
  pageId: number; // 【自动生成】按照url hash成的数字
  pageUrl: string; // 页面的url
  pageTitle: string; // 页面的title
  eventTime?: number; // 这次事件的发生时间
}

// 自动
export interface EventTypeInfo {
  // emit事件(自定义事件) | click事件 | 组件展示 elementShow
  type:
    | 'emit'
    | 'click'
    | 'elementShow'
    //  整个应用
    | 'appLaunch'
    | 'appClose'
    | 'appHide'
    | 'appActive'
    // 单个页面事件
    | 'pageCreate'
    | 'pageClose'
    | 'pageHide'
    | 'pageActive'
    // 异常事件
    | 'error'
    | 'elementError'
    | 'fetchError';
  data?:
    | EventClickInfo
    | EventClickInfo[]
    | EventElementShowInfo
    // 应用事件
    | EventAppLaunchInfo
    | EventAppHideInfo
    | EventAppActiveInfo
    | EventAppCloseInfo
    // 单个页面事件
    | EventPageCreateInfo
    | EventPageCloseInfo
    | EventPageHideInfo
    | EventPageActiveInfo
    // 异常事件
    | EventErrorInfo
    | EventElementErrorInfo
    | EventFetchErrorInfo;
}

// click
export interface EventClickInfo {
  screenX: number; // 点击事件发生时鼠标对应的屏幕x轴坐标.
  screenY: number; // 击事件发生时鼠标对应的屏幕y轴坐标.
  clientX: number; // 点击事件发生时鼠标对应的浏览器窗口的x轴坐标.
  clientY: number; // 点击事件发生时鼠标对应的浏览器窗口的y轴坐标.
  detail: number; // 在短时间内发生的连续点击次数的计数。
}

// 组件展示 elementShow
export interface EventElementShowInfo {}
// app启动
export interface EventAppLaunchInfo {}

// appHide
export interface EventAppHideInfo {
  showTime: number; //app显示了多长时间
}

// appActive
export interface EventAppActiveInfo {
  hideTime: number; // 应用隐藏了多少时间
}

// appClose
export interface EventAppCloseInfo {
  stayTime: number; // 应用开启了多少时间
}

// 页面创建pageCreate
export interface EventPageCreateInfo {
  prvPageId: number; // 上一个页面的id
  prvPageUrl: string; //  上一个页面的url
  prvPageTitle: string; //  上一个页面的title
  prvHref: string; // 上一个页面的完整url
}

// 页面关闭pageClose
export interface EventPageCloseInfo {
  stayTime: number; // 整个页面的停留时间
}

// 页面隐藏pageHide
export interface EventPageHideInfo {
  showTime: number; // 页面显示了多长时间
}

// 页面激活pageActive
export interface EventPageActiveInfo {
  hideTime: number; // 页面隐藏的时间
}

// 页面报错的事件
export interface EventErrorInfo {
  message: string; // 错误
  error: Error;
}

// 元素报错的事件
export interface EventElementErrorInfo {
  name: string; // 元素name
  message: string; // 元素报错的信息
  error: Error;
}

// 资源fetchError
export interface EventFetchErrorInfo {
  url: string; // 出错的url
  message: string; // 元素报错的信息
  error: Error;
}
