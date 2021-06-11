import React, {PureComponent} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

class WaterFall extends PureComponent {
  constructor() {
    super()
    this.state = {
      waterfall: []
    }

  }

  componentDidMount() {
    this.intialize()
    document.body.onresize = () => {
      this.resetWaterfall()
    }
  }

  componentWillUnmount() {
    document.body.onresize = null
  }

  intialize = () => {
    const {itemWith} = this.props
    this.dataIndex = 0
    let containerDOM = ReactDOM.findDOMNode(this.refs.waterfall_container)
    let columns = this.getColumn(containerDOM, itemWith || 230)
    this.setState({
      columns,
      waterfall: fillArray([], columns)
    })
  }
  resetWaterfall = () => {

    this.setState({
      columns: 0,
      waterfall: []
    }, this.intialize)

  }
  getArrayShorterIndex = (newArr) =>{
    let resultIndex = []
    newArr.forEach((item,index)=>{
      resultIndex.push({
        length:item.length,
        index
      })
    })
    resultIndex.sort((a,b)=>a.length-b.length)
    return resultIndex[0].index
  }
  startWaterFall = () => {
    const {data} = this.props

    this.setState(prevState => {

      //图片加载计算不出getColumnHeight 所以用了shortArrayIndex 代替
      // let heightArr = this.getColumnHeight()
      // let minHeightInArrIndex = getIndexFromArray(heightArr,
      //     Math.min.apply(this, heightArr))

      let newArr = [].concat(prevState.waterfall)
      // 那个数组最短，就接入哪个
      let shortArrayIndex = this.getArrayShorterIndex(prevState.waterfall)
      let _willAdd = newArr.splice(shortArrayIndex, 1)[0]
      _willAdd = _willAdd.concat(data[this.dataIndex++])
      newArr.splice(shortArrayIndex, 0, _willAdd)
      return {
        waterfall: newArr
      }

    })

  }

  componentDidUpdate(prevProps, prevState, prevContext) {
    let {columns} = this.state
    const {data} = this.props
    if (columns && this.dataIndex < data.length) {
      this.startWaterFall()
    }
  }

  getColumn = (container, column_width) => {
    return (container.offsetWidth / column_width) | 0
  }

  // getColumnHeight = () => {
  //   const {columns} = this.state
  //   return fillArray(1, columns).map((item, index) => {
  //     let ref = this.refs[`columns_container_${index}`]
  //     let element = ReactDOM.findDOMNode(ref)
  //     return element.offsetHeight
  //   })
  // }

  render() {
    const {data, renderItem, ...rest} = this.props
    const {columns, waterfall} = this.state
    return (
        <div ref="waterfall_container"
             style={{display: 'flex', justifyContent: 'flex-start', overflow: 'auto', alignItems: 'flex-start'}}
             {...rest}
        >
          {columns &&
          fillArray(1, columns).map((item, index) => {
            return (
                <div key={index} id={index}
                     ref={`columns_container_${index}`}>
                  {waterfall[index].map((itemData, _index) => {
                    return  renderItem(itemData, _index)
                  })}
                </div>
            )
          })}
        </div>
    )
  }
}

WaterFall.propTypes = {
  data: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired
}
WaterFall.defaultProps = {}

function fillArray(item, length) {
  let result = []
  for (let i = 0; i < length; i++) {
    result.push(item)
  }
  return result
}

// function getIndexFromArray(targetArr, item) {
//   let targetIndex
//   targetArr.map((_item, index) => {
//     if (_item === item && targetIndex === undefined) {
//       targetIndex = index
//     }
//   })
//   if (targetIndex !== undefined) {
//     return targetIndex
//   }
//   throw Error(`can't find ${item} in ${targetArr}`)
// }

export default WaterFall
