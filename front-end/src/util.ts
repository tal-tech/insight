import { v4 as uuidv4 } from 'uuid'
export const cookie = {
  read(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'))
    return match ? decodeURIComponent(match[3]) : null
  },
  set(name: string, value = uuidv4()) {
    const d = new Date();
    d.setTime(d.getTime() + 1000 * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};path=/;expires=' + ${d}.toUTCString() + ';domain=`;
    return value
  }
}

/**
 * from https://www.codenong.com/7616461/
 * @param str 
 */
export function hashCode(str): number {
    if(!str){
        return -1
    }
    if (Array.prototype.reduce){
        return str.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0) + 2147483647 + 1;
    }
    let hash = 0, i, chr;
    for (i = 0; i < str.length; i++) {
      chr   = str.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash + 2147483647 + 1;
};

// from lodash 
export function throttle(func, wait = 200, options?: {
    leading?: boolean;
    trailing?: boolean
  }) {
    var context, args, result;
    var timeout = null;
  
    var previous = 0;
    if (!options)
      options = {};
  
    var later = function () {
      // 如果 options.leading === false
      // 则每次触发回调后将 previous 置为 0
      // 否则置为当前时间戳
      previous = options.leading === false ? 0 : +Date.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout)
        context = args = null;
    };
  
    return function (...args) {
      // 记录当前时间戳
      var now = +Date.now();
  
      // 第一次执行回调（此时 previous 为 0，之后 previous 值为上一次时间戳）
      // 并且如果程序设定第一个回调不是立即执行的（options.leading === false）
      // 则将 previous 值（表示上次执行的时间戳）设为 now 的时间戳（第一次触发时）
      // 表示刚执行过，这次就不用执行了
      if (!previous && options.leading === false)
        previous = now;
  
      var remaining = wait - (now - previous);
      context = this;
  
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
  
        previous = now;
        result = func.apply(context, args);
        if (!timeout)
          context = args = null;
      } else if (!timeout && options.trailing !== false) { // 最后一次需要触发的情况
        // 如果已经存在一个定时器，则不会进入该 if 分支
        // 如果 {trailing: false}，即最后一次不需要触发了，也不会进入这个分支
        // 间隔 remaining milliseconds 后触发 later 方法
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

/**
 * 把一个sign字符串解析成对象
 * 比如
 *  输入signStr：key=WMuQ;secret=abc;signature=abcd
 *  输出: {
 *      key: WMuQ,
 *      secret: abc,
 *      signature: abcd
 * }
 * @param signStr 
 */
export function getSignBySignStr(signStr: string){
    const sign = {}
    signStr.split(";").forEach(k => {
      const temp = k.replace("=",":").split(":")
      sign[temp[0]] = temp[1]
    })
    return sign
}