import React from 'react'
import { Route } from 'react-router-dom'
import NavHeader from '../../components/NavHeader'
// import './index.scss'
import styles from './index.module.css'
export default class Map extends React.Component {

  componentDidMount() {
    //初始化地图实例
    //注意 在react脚手架中全局对象需要window来访问 否则会ESlint校验错误
    const map = new window.BMapGL.Map('container')
    //设置中心点坐标
    const point = new window.BMapGL.Point(116.404, 39.915)
    //初始化地图
    map.centerAndZoom(point, 15)
  }

  render () {
    return (
        <div className={styles.map}>
          <NavHeader
            onLeftClick={() => {
              this.props.history.go(-1)
            }}
          >
            地图找房
          </NavHeader>
          <div id="container" className={styles.container}></div>
        </div>
    )
  }
}