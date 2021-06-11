export interface ClickInfo {
  elementKey: number;
  desc: string;
  data: {
    screenX: number; // 点击事件发生时鼠标对应的屏幕x轴坐标.
    screenY: number; // 击事件发生时鼠标对应的屏幕y轴坐标.
    clientX: number; // 点击事件发生时鼠标对应的浏览器窗口的x轴坐标.
    clientY: number; // 点击事件发生时鼠标对应的浏览器窗口的y轴坐标.
    detail: number; // 在短时间内发生的连续点击次数的计数。
  };
}
/**
 *
 * @param event
 * @param type  xt意思 x => xhb t=> trace
 */
export function getClickInfo(event: MouseEvent, type = 'xt'): ClickInfo {
  let node = event.target as HTMLElement;
  let i = 0;
  // 向上找三层
  while (node && i < 3) {
    if (!(node.dataset && node.dataset[type])) {
      node = node.parentNode as HTMLElement;
      // eslint-disable-next-line no-plusplus
      ++i;
    } else {
      break;
    }
  }
  if (node?.constructor?.name === 'HTMLDocument') {
    node = event.target as HTMLElement;
  }
  const id = node?.dataset?.[type] || -1;
  const defaultDesc = node?.textContent ? node.textContent?.slice(0, 10) : 'default_click'; // 默认取点击的文本内容
  const { screenX, screenY, clientX, clientY, detail } = event;
  return {
    elementKey: Number(id),
    desc: defaultDesc.replace(/\n/g, '').trim(),
    data: {
      screenX,
      screenY,
      clientX,
      clientY,
      detail
    }
  };
}

// 自定义事件，并dispatch
export const dispatchCustomEvent = function (e, detail) {
  let result;
  if (window.CustomEvent) {
    result = new CustomEvent(e, { detail });
  } else {
    result = window.document.createEvent('HTMLEvents');
    result.initEvent(e, !1, !0);
    result.detail = detail;
  }
  window.dispatchEvent(result);
};

export const bindEventListener = function (type) {
  const historyEvent = history[type];
  return function () {
    const newEvent = historyEvent.apply(this, arguments);
    let e = window.event;
    if (window.Event) {
      e = new Event(type);
    }
    // @ts-ignore
    e.arguments = arguments;
    window.dispatchEvent(e);
    return newEvent;
  };
};

export function getLines(stack: string): string {
  if (!stack) return '';
  return stack
    .split('\n')
    .slice(1)
    .map((item) => item.replace(/^\s+at\s+/g, ''))
    .join('');
}
