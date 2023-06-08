import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import ProductAddUpdate from './add-update'
import ProductDetail from './detail'
import ProductHome from './home'
import './css/product.less'

/* 商品路由 */
export default class Product extends Component {
  render() {
    return (
      <Switch>
        <Route path='/product' component={ProductHome} exact/>
        <Route path='/product/addupdate' component={ProductAddUpdate}/>
        <Route path='/product/detail' component={ProductDetail}/>
        <Redirect to='/product'/>
      </Switch>
    )
  }
}
