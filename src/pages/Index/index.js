import React from 'react'
import { Carousel, Flex, Grid, WingBlank  } from 'antd-mobile';
import axios from 'axios'
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'
// 导入样式文件
import './index.scss'
//导航菜单数据
const navs = [ 
  {
    id: 1,
    img: Nav1,
    title: '整租',
    path: '/home/list'
  },
  {
    id: 2,
    img: Nav2,
    title: '合租',
    path: '/home/list'
  },
  {
    id: 3,
    img: Nav3,
    title: '地图找房',
    path: '/home/list'
  },
  {
    id: 4,
    img: Nav4,
    title: '去出租',
    path: '/home/list'
  },
]

//获取地理位置信息
// navigator.geolocation.getCurrentPosition(position => {
//   console.log('position',position)
// })
//百度 veIHxCkxHDZ0ddsGCPMF1SkMgW9Fvud1

export default class Index extends React.Component {
  state = {
    //轮播图状态数据
    swipers: [1, 2, 3],
    isSwiperLoaded: false,
    groups: [],
    news: [],
    curCityName:'上海'
  }

  //获取轮播图数据的方法
  async getSwipers () { 
    const res = await axios.get('http://101.132.119.44:9090/home/swiper')
    // console.log(res)
    this.setState(() => { 
      return {
        swipers: res.data.body, //不用箭头函数 直接简化也可以
        isSwiperLoaded: true
      }
    })
    // console.log(this.state.swipers)
  }

  //获取租房小组信息
  async getGroups() {
    const res = await axios.get('http://101.132.119.44:9090/home/groups', {
      params: {
        area: 'AREA%7C88cff55c-aaa4-e2e0'
      }
    })
    this.setState({
      groups: res.data.body
    })
  }

  //获取最新资讯
  async getNews() {
    const res = await axios.get('http://101.132.119.44:9090/home/news?area=AREA%7C88cff55c-aaa4-e2e0')
    this.setState({
      news: res.data.body
    })
  }

  componentDidMount () {
    this.getSwipers();
    this.getGroups();
    this.getNews();

    // window.addEventListener('touchmove', func, { passive: false 
    //通过ip定位当前城市名称
    const curCity = new window.BMapGL.LocalCity()
    curCity.get(async res => {
      const result = await axios.get(`http://101.132.119.44:9090/area/info?name=${res.name}`) //只有北上广深有数据，当前没有默认上海
      this.setState({
        curCityName: result.data.body.label
      })
    })
    
  }

  // 渲染轮播图结构
  renderSwipers () {
    return this.state.swipers.map(item => (
      <a
        key={item.id}
        href="*"
        style={{
          display: 'inline-block',
          width: '100%',
          height: 212
        }}
      >
        <img
          src={`http://101.132.119.44:9090${item.imgSrc}`} // /img/swiper/2.png
          alt=""
          style={{ width: '100%', verticalAlign: 'top' }}
        />
      </a>
    ))
  }

  //渲染导航菜单
  renderNavs() {
    return navs.map(item => (
      <Flex.Item
        key={item.id}
        onClick={() => this.props.history.push(item.path)}
      >
        <img src={item.img} alt="导航菜单" />
        <h2>{item.title}</h2>
      </Flex.Item>
    ))
  }

  //渲染最新资讯
  renderNews() {
    return this.state.news.map(item => (
      <div className="newsItem" key={item.id}>
        <div className="news-item">
          <img
            className="img"
            src={`http://101.132.119.44:9090${item.imgSrc}`}
            alt=""
          />

          <div className="content" direction="column" justify="between">
            <h3 className="title">{item.title}</h3>
            <div className="info" justify="between">
              <span>{item.from}</span>
              <span>{item.date}</span>
            </div>
          </div>
        </div>
        <div className="split"></div>
      </div>
      
    ))
  }

  render () {
    return (
      <div className='index'>

        {/* 轮播图 */}
        <div className="swiper">
        {
          this.state.isSwiperLoaded ? 
          <Carousel
          autoplay={true}
          infinite //循环播放
          autoplayInterval={2000}
          >
            {this.renderSwipers()}
          </Carousel> : ''
        }
        
        {/* 搜索框 */}
        <Flex className="search-box">
          {/* 左侧 */}
          <Flex className="search">
            <div className="location" onClick={() => this.props.history.push('/citylist')}>
              <span className="name">{this.state.curCityName}</span>
              <i className="iconfont icon-arrow"></i>
            </div>

            <div className="form" onClick={() => this.props.history.push('/search')}>
              <i className="iconfont icon-seach"></i>
              <span className="text">请输入小区或地址</span>
            </div>
          </Flex>
          {/* 地图 */}
          <i className="iconfont icon-map" onClick={() => this.props.history.push('/map')}></i>
        </Flex>
        </div>

        
        {/* 导航菜单 */}
        <Flex className="nav">
          {this.renderNavs()}
        </Flex>

        {/* 租房小组 */}
        <div className="group">
          <h3 className="groupTitle">
            租房小组 <span className="more">更多</span>
          </h3>
          <div>
            <Grid data={this.state.groups} 
              columnNum={2}
              square={false}
              hasLine={false} 
              renderItem={ (item) => (
                <Flex className="group-item" justify="around" key={item.id}>
                  <div className="desc">
                    <p className="title">{item.title}</p>
                    <span className="info">{item.desc}</span>
                  </div>
                  <img
                    src={`http://101.132.119.44:9090${item.imgSrc}`}
                    alt=""
                  />
                </Flex>
              )}/>
          </div>
        </div>

        {/* 最新资讯 */}
        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          <WingBlank size="md">
            {this.renderNews()}
          </WingBlank>
        </div>
      </div>
    );
  }
}