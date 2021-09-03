import React from 'react';
import ReactDOM from 'react-dom';

import 'react-virtualized/styles.css'
import 'antd-mobile/dist/antd-mobile.css';  // or 'antd-mobile/dist/antd-mobile.less'

import './assets/fonts/iconfont.css'

import './index.css';

import App from './App';
//将组件导入放到样式导入后面 从而避免样式覆盖问题
ReactDOM.render(
  <App />,
  document.getElementById('root')
);
