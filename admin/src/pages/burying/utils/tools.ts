export const sortTraceData = (traceData: any) => {
  const traceArray: Array<any> = []
  const frontTraceArray: Array<any> = []
  for (let key in traceData) {
    if (key === 'key') {
      frontTraceArray.push({
        key,
        value: traceData[key],
        index: 1
      })
    } else if (key === 'button_key') {
      frontTraceArray.push({
        key,
        value: traceData[key],
        index: 2
      })
    } else if (key === 'desc') {
      frontTraceArray.push({
        key,
        value: traceData[key],
        index: 3
      })
    } else if (key === 'page_title') {
      frontTraceArray.push({
        key,
        value: traceData[key],
        index: 4
      })
    }else if (key === 'component_name') {
      frontTraceArray.push({
        key,
        value: traceData[key],
        index: 5
      })
    } else if (key === 'path') {
      frontTraceArray.push({
        key,
        value: traceData[key],
        index: 5
      })
    }  else if (key === 'group_id') {
      frontTraceArray.push({
        key,
        value: traceData[key],
        index: 7
      })
    }else {
      traceArray.push({
        key,
        value: traceData[key]
      })
    }
  }

  frontTraceArray.sort((a, b) => a.index - b.index)
  traceArray.sort() // a-z排序
  const concatArray = [...frontTraceArray, ...traceArray]
  return concatArray
}


export const handleBuryNameInCurrentTree = (treeData: any, id: number, traceName: string): any => {
  treeData.forEach((item: any) => {
    if (item.id === id) {
      item.traceName = traceName
    }
    if (item.children) {
      item.children = handleBuryNameInCurrentTree(item.children, id, traceName)
    }
  })
  return treeData
}

let arr: any = [] // 收集所有title 防止重复 导致跳转错误
let count = 0 // 随机数字
// 匹配表情形式的emoji数字
let numMap : any = {
  '0': '0⃣️',
  '1': '1⃣️',
  '2': '2⃣️',
  '3': '3⃣️',
  '4': '4⃣️',
  '5': '5⃣️',
  '6': '6⃣️',
  '7': '7⃣️',
  '8': '8⃣️',
  '9': '9⃣️',
}
// 数字转表情
const numSwitch = (num: any) =>{
  let stringNum = String(num)
  let res = ``
  for(let i = 0; i< stringNum.length; i++){
    let key = stringNum[i]
    res = `${res}${numMap[key]}`
  }
  return res
}

// 初始化页面 处理后端传来的树结构数据，，处理字段名，添加title key
export const initPageHandleDataTree = (treeData: any, init = true): any => {
  // 每棵树都维护唯一的subPath
  if(init){
    arr = []
    count = 0
  }
  treeData.forEach((item: any, index: number) => {
    if (arr.includes(item.subPath)) {
      count++
      item.title = item.subPath + numSwitch(count)
    } else {
      item.title = item.subPath
    }
    arr.push(item.title)
    item.key = item.subPath === 'root' ? item.subPath : item.path + item.subPath + Math.random()
    if (item.children) {
      item.children = initPageHandleDataTree(item.children, false)
    }
  })
  return treeData
}

export const getCurrentDisplayType = (displayCurrentPhoneType: string, hasAndroid: boolean, hasIOS: boolean): string => {
  let displayType = displayCurrentPhoneType
  // 前提是 displayCurrentPhoneType 传入的是'' 说明是第一次加载
  if (!displayCurrentPhoneType) {

    // 有安卓数据，没有 ios 数据展示 ios ，同时设置button 设置type
    if (hasAndroid && !hasIOS) {
      displayType = 'android'
    }

    // 有ios数据 没有安卓数据 展示 ios
    if (!hasAndroid && hasIOS) {
      displayType = 'ios'
    }

    if ((hasAndroid && hasIOS) || (!hasAndroid && !hasIOS)) {
      // 两个都没有,或者两个数据都有，展示ios数据
      displayType = 'ios'
    }
  }

  return displayType
}

interface IVersion{
  version:string
}
// 对版本号的排序
export function versionSort(arr: IVersion[]) {
  arr?.sort((a, b) => {
    var items1 = a.version.split('.')
    var items2 = b.version.split('.')
    var k = 0
    for (let i in items1) {
      let a1 = items1[i]
      let b1 = items2[i]
      if (typeof a1 === undefined) {
        k = -1
        break
      } else if (typeof b1 === undefined) {
        k = 1
        break
      } else {
        if (a1 === b1) {
          continue
        }
        k = Number(a1) - Number(b1)
        break
      }
    }
    return k
  })
  let result:any = []
  arr.forEach(item=>{
    result.unshift(item)
  })

  return result
}

export function loadImg(urlArr: Array<any>) {
  let p = new Promise((resolve, reject) => {
    let loadNum = 0;
    let res: Array<any> = []; // 链接结果
    urlArr.forEach((item, index) => {
      let img: HTMLImageElement | null = new Image();
      img.src = item;
      img.onload = function () {
        res[index] = img;
        loadNum++;
        if (loadNum === urlArr.length) {
          resolve(res);
        }
      };
      img.onerror = function () {
        reject(item);
      };
    });
  });
  p.catch(err=>{
    console.log('loadImg: 图片加载失败', err)
  })
  return p
}
