export function limitStringLength(string: string, number: number) {
  return string?.length > number ? string.slice(0, number) + '...' : string;
}

export function onScroll(event: any, callback: () => void) {
  console.log('[onScroll]', event);
  const target = event.target;

  // 滚动条的总高度
  const scrollHeight = target.scrollHeight;
  // 可视区的高度
  const clientHeight = target.clientHeight;
  // 距离顶部的距离
  const scrollTop = target.scrollTop;

  // 滚动到底部
  if (scrollTop + clientHeight >= scrollHeight) {
    console.log('滚动到底部了');
    callback();
  }
}

export function formatTime(timestamp: number) {

  let date = new Date(timestamp * 1000)
  // const y = date.getFullYear() + '.'
  const m =
      (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '-'
  const d =
      date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '

  const gh = date.getHours()
  // const h = gh < 10 ? '0' + gh + ':' : gh + ':'

  const gm = date.getMinutes()
  // const min = gm < 10 ? '0' + gm : gm
  return m + d
}
