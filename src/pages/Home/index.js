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
    selectedTab: this.props.location.pathname //默认选中的tabbar菜单项 和页面的url
  }
 
  componentDidUpdate(prevProps) { //使用componentDidUpdate钩子函数 要放在判断里 不然发生改变就执行这个钩子函数 从而一直循环递归
    console.log(prevProps);
    console.log(this.props);
    if(prevProps.location.pathname !== this.props.location.pathname) {
      //路由发生切换
      this.setState({
        selectedTab: this.props.location.pathname,
      })
    }
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
      selected={this.state.selectedTab === item.path} //高亮显示

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
    console.log(this.props.location.pathname) // /home/profile     exact精确匹配
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
          noRenderContent={true} //不渲染内容
        >
          {/* 抽离渲染的TabBarItem */}
          {this.renderTabBarItem()}
        </TabBar>
      </div>
    </div>
  }
}