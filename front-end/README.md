

## 哓程序使用方式

埋点SDK默认已经打包进xp-sdk了，不需要额外引入，把xp-sdk升级到最新版本版本就可以了。

行为数据都会在sdk内收集，如果需要进行特殊业务埋点，请看下面代码

```
$xp.trace({
  elementKey: 1233, (这必须是数字) 必传

  desc: "埋点相关的描述", （可以不传）
  params: // 自定义数据类型（可以不传），
  typeInfo: { // 行为数据的类型，默认可以不传
    type: "emit", //默认是emit 其他可以类型可以查看 src/interface.ts内的 EventTypeInfo
  }
})
```
## web端使用方式

```
import Monitor from '@heibanfe/monitor';

const monitor = new Monitor({
  appId: 1 | 2 | 3 | 4 
  projectId: // 项目ID，这块默认是后端生成，也可以前端生成，生成后不能随意变更
  axios: any // 一般是项目的axios

  env?: 'local' | 'dev' | 'test' | 'pre' | 'prod'
  isDebug?: boolean // 是否开启日志打印 默认为false ，也可以在localstorage内设置一个值为trace-debug为1也可以。
})

```
如果需要进行特殊业务埋点
```
monitor.trace({
  elementKey: 1233, (这必须是数字) 必传

  desc: "埋点相关的描述", （可以不传）
  params: // 自定义数据类型（可以不传），
  typeInfo: { // 行为数据的类型，默认可以不传
    type: "emit", //默认是emit 其他可以类型可以查看 src/interface.ts内的 EventTypeInfo
  }
})

也可以window._trace
```

## 微信小程序使用方式
TODO: 还在计划中




##  build
```
yarn build
```
##  发包
```
make publish
```
## 功能
* 暴露全局方法_trace
* 暴露原生data-bi-click 属性，来自动收集点击埋点


### 方法一
#### 1.1
```html 
 // 也就是可以利用cdn的方式  参考example/index.html
  <script src='../dist/index.js'></script>
  <script>
    new XhbMonitor({
      id: 'xxxx',
      userId: 'xxx',
    })
    _trace('10000.1')
    /* 
    如果需要传groupId的话 可以是
    _trace('9999.10000.1')
    9999为 groupId
    10000为 pageId
    10000.1为 typeId
    */
  </script>
 
```
#### 1.2
```html 
 // 也就是可以利用cdn的方式  参考example/index2.html 无需要实例化XhbMonitor
  <script src=''></script>
  <script>
    _trace('10000.1')
  </script>
 
```

### 方法二
```
yarn add @heibanfe/monitor -S
```

```js
import XhbMonitor from '@heibanfe/monitor'

// 在项目入口文件初初始化实例即可
const trace = new XhbMonitor({
   id: 'xxxx',
   userId: 'xxx'
})

export {trace}
// 引入之后
 trace.send({xxxx})
 // 也可以直接用window上的方法
 _trace({pageId: 100000, typeId: '100000.1', path: '/test', desc: '点击测试'})
```
 > 参考pc客户端埋点文档说明： https://docs.qq.com/sheet/DR0txVHpvR01JWG5B?tab=qegtx7


## 配置
```js
{
  //  项目id 一个项目唯一，对应数据后台appId字段
  id: string,
  // 用户id 可以传入string 也可以是个function
  userId?: any,
  // 环境区分
  env: 'local' | 'dev' | 'test' | 'pre' | 'prod' // 默认 dev
}

```