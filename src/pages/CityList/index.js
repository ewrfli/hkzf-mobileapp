import React from 'react'
import axios from 'axios'
import { NavBar, Toast } from 'antd-mobile';
import { AutoSizer, List } from 'react-virtualized';
import NavHeader from '../../components/NavHeader'
import './index.scss'
// import styles from './index.module.css'
import { getCurrentCity } from '../../utils'
//res.data.body [{}, {}]
//渲染城市列表数据格式 {a: [{},{}], b: [{}, {}] }  item["a"] = [{}, {}]
//渲染右侧索引数据格式['a', 'b']

//数据格式化方法 
const formatCityData = (list) => {
  const cityList = {}
  // const cityIndex= []

  list.forEach(item => {
    const first = item.short.substr(0, 1)
    if(cityList[first]) {
      cityList[first].push(item)
    } else {
      cityList[first] = [] //item["a"]=[] => {a: []}
      cityList[first] = [item]
    }
  })
  const cityIndex = Object.keys(cityList).sort()

  return { cityList, cityIndex }
}
//封装处理字母索引小写转大写等
const formatCityIndex = (letter) => {
  switch (letter) {
    case '#':
      return '当前定位'
    case 'hot':
      return '热门城市'
    default:
      return letter.toUpperCase()  
  }
}

//索引字母的高度
const TITLE_HEIGHT = 36 
const NAME_HEIGHT = 50

// 有房源的城市
const HOUSE_CITY = ['北京', '上海', '广州', '深圳']

export default class CityList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      cityList: {},
      cityIndex: [],
      // 指定右侧字母索引列表高亮的索引号
      activeIndex: 0
    }
    //创建ref对象
    this.cityListComponent = React.createRef()
  }


  async componentDidMount() {
    await this.getCityList()
    //提前计算List中每一行的【高度】，实现scrollToRow的精确跳转
    //注意调用这个方法时要保证List里有数据(List里是异步加载的)，如果里面数据空就报错
    this.cityListComponent.current.measureAllRows()
  }

  //获取城市列表
  async getCityList() {
    const res = await axios.get('http://101.132.119.44:9090/area/city?level=1')
    console.log(res.data.body)
    const { cityList, cityIndex } = formatCityData(res.data.body)

    //add热门城市
    const hotRes = await axios.get('http://101.132.119.44:9090/area/hot')
    cityList['hot'] = hotRes.data.body
    cityIndex.unshift('hot')//头部插入

    //获取当前城市 
    const curCity = await getCurrentCity()
    cityList['#'] = [curCity]
    cityIndex.unshift('#')

    console.log(cityList, cityIndex, curCity)
    this.setState({
      cityIndex,
      cityList
    })
  }
  //改变城市信息
  changeCity({ label, value}) {
    if(HOUSE_CITY.indexOf(label) > -1){
      // 有
      localStorage.setItem('hkzf_city', JSON.stringify({ label, value }))
      this.props.history.go(-1)
    } else {
      Toast.info('该城市暂无房源数据', 1, null, false)
    }
  }
  //List渲染每一行内容
  rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // 当前项是否滚动中
    isVisible, // 当前项List可见
    style, // 一定给每一行数据添加该样式，作用：指定每一行的位置
  }) => {
    //每一行字母索引
    const { cityIndex, cityList } = this.state
    const letter = cityIndex[index] //a b  c
    //获取指定字母索引下城市
    // console.log(cityList) //[{…}, {…}, {…}, {…}]  [{…}, {…}]
    return ( //页面内容
      <div key={ key } style={ style } className="city"> 
        <div className="title">{ formatCityIndex(letter) }</div>
        {cityList[letter].map(item => (
          <div
            className="name"
            key={item.value}
            onClick={() => this.changeCity(item)}
          >
            {item.label}
          </div>
        ))}
      </div>
    )
  }

  //动态计算每一行高度
  getRowHeight = ({ index }) => {
    // console.log(index) 0 1 2 3...
    const { cityList, cityIndex } = this.state
    return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
  }

  //渲染右侧索引方法
  renderCityIndex() {
    const { cityIndex, activeIndex } = this.state
    return cityIndex.map((item, index) => 
      <li className="city-index-item" key={item} onClick={() => {
        console.log('当前索引', index)
        this.cityListComponent.current.scrollToRow(index)//跳转到索引
      }}>
        <span className={activeIndex === index ? "index-active" : ''}>
          {item === 'hot' ? '热' : item.toUpperCase()}
        </span>
      </li>
    )
  }

  //获取List组件渲染行的信息
  onRowsRendered = ({ startIndex }) => {
    if (this.state.activeIndex !== startIndex) {
      this.setState({
        activeIndex: startIndex
      })
    }
  }

  render () {
    return (
        <div className="citylist"> 
          <NavHeader>城市选择</NavHeader>

          {/* 城市列表 */}
          <AutoSizer>
            {({height, width}) => (
              <List
                ref={this.cityListComponent}
                scrollToAlignment="start"
                height={height}
                width={width}
                rowCount={this.state.cityIndex.length}
                rowHeight={this.getRowHeight}
                rowRenderer={this.rowRenderer}
                onRowsRendered={this.onRowsRendered}
              />
            )}
          </AutoSizer>

          {/* 右侧索引列表 */}
          <ul className="city-index">
            { this.renderCityIndex() }
          </ul>
        </div>
    )
  }
}