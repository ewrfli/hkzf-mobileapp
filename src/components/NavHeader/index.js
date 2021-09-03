import React from 'react'
import { NavBar } from 'antd-mobile';
import { withRouter  } from 'react-router'; //高阶组件
// 导入 props 校验的包
import PropTypes from 'prop-types'
// import './index.scss'
import styles from './index.module.css'

function NavHeader(props) {
  //默认点击行为
  const defaultHandler = () => props.history.go(-1)
  return (
    <NavBar
      className={styles.navBar}
      mode="light"
      icon={<i className="iconfont icon-back" />}
      onLeftClick={ props.onLeftClick || defaultHandler }
    >
      { props.children }
    </NavBar>
  )
}

// 添加props校验
NavHeader.propTypes = {
  children: PropTypes.string.isRequired,
  onLeftClick: PropTypes.func,

}

export default withRouter(NavHeader)