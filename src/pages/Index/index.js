import React from 'react'
import { Carousel, Flex } from 'antd-mobile';

import axios from 'axios'
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'
// 导入样式文件
import './index.css'

export default class Index extends React.Component {

  state = {
    //轮播图状态数据
    swipers: []

  }

  //获取轮播图数据的方法
  async getSwipers () {
    const res = await axios.get('http://101.132.119.44:9090/home/swiper')
    // console.log(res)
    this.setState(() => {
      return {
        swipers: res.data.body
      }
    })
  }




  componentDidMount () {
    this.getSwipers()
  }

  // 渲染轮播图结构
  renderSwipers () {
    return this.state.swipers.map(item => (
      <a
        key={item.id}
        href="http://101.132.119.44:9090"
        style={{
          display: 'inline-block',
          width: '100%',
          height: 212
        }}
      >
        <img
          src={`http://101.132.119.44:9090${item.imgSrc}`}
          alt=""
          style={{ width: '100%', verticalAlign: 'top' }}
        />
      </a>
    ))
  }
  render () {
    return (
      <div className='index'>

        {/* 轮播图 */}
        <Carousel
          autoplay={true}
          infinite
          autoplayInterval={2000}
        >
          {this.renderSwipers()}
        </Carousel>

        {/* 导航菜单 */}
        <Flex className="nav">
          <Flex.Item>
            <img src={Nav1} alt="" />
            <h2>整租</h2>
          </Flex.Item>
          <Flex.Item>
            <img src={Nav2} alt="" />
            <h2>合租</h2>
          </Flex.Item>
          <Flex.Item>
            <img src={Nav3} alt="" />
            <h2>地图找房</h2>
          </Flex.Item>
          <Flex.Item>
            <img src={Nav4} alt="" />
            <h2>去出租</h2>
          </Flex.Item>

        </Flex>

      </div>
    );
  }
}