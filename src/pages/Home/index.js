import React from 'react'
import { Route } from 'react-router-dom'
import Index from '../Index'
import HouseList from '../HouseList'
import News from '../News'
import Profile from '../Profile'

import { TabBar } from 'antd-mobile';
import './index.css'


//TabBar 数据
const tabItems = [
  {
    title: '首页',
    icon: 'icon-ind',
    path: '/home'
  },
  {
    title: '找房',
    icon: 'icon-findHouse',
    path: '/home/list'
  },
  {
    title: '资讯',
    icon: 'icon-infom',
    path: '/home/news'
  },
  {
    title: '我的',
    icon: 'icon-my',
    path: '/home/profile'
  }
]

export default class Home extends React.Component {
  state = {
    selectedTab: this.props.location.pathname
  }

  //使用map方法,遍历数据,渲染 Tabbar Item
  renderTabBarItem () {
    return tabItems.map(item => <TabBar.Item
      title={item.title}
      key={item.title}
      icon={
        <i className={`iconfont ${item.icon}`} />
      }
      selectedIcon={
        <i className={`iconfont ${item.icon}`} />
      }
      selected={this.state.selectedTab === item.path}

      onPress={() => {
        this.setState({
          selectedTab: item.path,
        });

        //路由切换
        this.props.history.push(item.path)
      }}
      data-seed="logId"
    >
    </TabBar.Item>)
  }


  render () {
    return <div className="home">
      <Route exact path="/home" component={Index}></Route>
      <Route path="/home/list" component={HouseList}></Route>
      <Route path="/home/news" component={News}></Route>
      <Route path="/home/profile" component={Profile}></Route>


      {/* TabBar菜单 */}

      <div>
        <TabBar
          unselectedTintColor="#888"
          tintColor="#21b97a"
          barTintColor="white"
          noRenderContent={true}
        >
          {/* 抽离渲染的TabBarItem */}
          {this.renderTabBarItem()}

        </TabBar>
      </div>


    </div>
  }
}