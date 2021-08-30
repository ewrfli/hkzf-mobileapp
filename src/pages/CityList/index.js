import React from 'react'
import { Route, Link } from 'react-router-dom'

export default class CityList extends React.Component {

  render () {
    return (
      <Route>
        <div>这是CityList</div>
        <div>
          <Link to="/home">去首页</Link>
        </div>
      </Route>
    )
  }
}