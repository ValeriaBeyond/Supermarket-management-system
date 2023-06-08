import React, { Component } from 'react'
import {Redirect, Route, Switch} from "react-router-dom"
import { Layout, Space } from 'antd'

import memoryUtils from '../../utils/memoryUtils'
import LeftNav from '../../components/left-nav/LeftNav';
import Header from '../../components/header/Header';
import Home from '../home/home'
import Role from '../role/role'
import Users from '../users/users'
import Category from '../category/category'
import Product from '../product/product'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'

const { Footer, Sider, Content } = Layout;


export default class Admin extends Component {
  render() {
    const user = memoryUtils.user
    // 如果内存没有存储user ==> 当前没有登陆
    if(!user || !user._id){
      return <Redirect to="/login"/>
    }
    return (
      // 设置最小高度，在内部子路由组件拉伸变高时，是将父组件撑高，而不会挡住父组件最底下的一行小字
      <Layout style={{minHeight: '100%'}}>
        <Sider>
          <LeftNav/>
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content style={{margin: 20, backgroundColor: '#fff'}}>
            <Switch>
              <Route path='/home' component={Home}/>
              <Route path='/category' component={Category}/>
              <Route path='/product' component={Product}/>
              <Route path='/users' component={Users}/>
              <Route path='/role' component={Role}/>
              <Route path="/charts/bar" component={Bar}/>
              <Route path="/charts/pie" component={Pie}/>
              <Route path="/charts/line" component={Line}/>
              <Redirect to='/home'/>
            </Switch>
          </Content>
          <Footer style={{textAlign: 'center', color: '#cccccc'}}>推荐使用谷歌浏览器，以获得更好地体验</Footer>
        </Layout>
      </Layout>
    )
  }
}
