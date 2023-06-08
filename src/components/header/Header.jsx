import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Modal } from 'antd';

import './index.less'
import {formateDate} from '../../utils/dateUtiles'
import memoryUtils from '../../utils/memoryUtils'
import {reqWeather} from'../../api/index'
import menuList from '../../config/menuConfig'
import storageUtils from '../../utils/storageUtils'
import LinkButton from '../link-button/linkButton';


class Header extends Component {

  state = {
    currentTime: formateDate(Date.now()),   //当前时间的字符串
    weather: '',    // 天气文本
    temperature: ''  // 温度 
  }

  getTime = ()=>{
    // 设置定时器时，记得定义一个 this.intervalId,方便后续清除定时器
    this.intervalId = setInterval(()=>{
      const currentTime = formateDate(Date.now());
      this.setState({currentTime:currentTime})
    }, 1000)
  }

  getWeather = async ()=>{
    // 调用接口请求函数获取数据
    const {weather, temperature} = await reqWeather()
    // 更新状态
    this.setState({weather, temperature:temperature+'°'})
  }

  getTitle = ()=>{
    // 得到当前请求路径:而location属性是路由组件专有的属性，所以调用withRouter(Header)，将Header作为一个具有路由组件的属性的组件暴露出来
    const path = this.props.location.pathname
    // console.log('this.props.location.pathname:',this.props.location.pathname)
    let title
    menuList.forEach(item => {
      if(item.key === path){
        title = item.title
      } else if(item.children){   // 如果当前item项有children
        const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
        if(cItem){
          title = cItem.title
        }
      }
    })
    return title
  }

  logout = ()=>{
    Modal.confirm({
      title: '确定退出登录吗?',
      onOk:()=> {     // 原本是普通函数，this为undefined。该外箭头函数，this变为外部的this，变为一个组件对象
        console.log('OK',this);
        // 删除保存的user数据
        storageUtils.removeUser()
        memoryUtils.user={}
        // 跳转到login
        this.props.history.replace('/login')

      },
      onCancel() {
        console.log('Cancel');
      },
    })
  }

  // 第一次render() 之后执行一次
  // 一般在此执行异步操作：发送ajax请求/启动定时器
  componentDidMount(){
    // 获取当前时间
    this.getTime()
    // 获取当前天气
    this.getWeather()
  }

  componentWillUnmount(){
    // 退出登陆后，组件被卸载，清除定时器
    clearInterval(this.intervalId)
  }

  render() {

    const {currentTime, weather, temperature} = this.state
    const username = memoryUtils.user.username
    const title = this.getTitle()

    return (
      <div className='header'>
        <div className='header-top'>
          <span>欢迎，{username}</span>
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className='header-bottom'>
          <div className='header-bottom-left'>{title}</div>
          <div className='header-bottom-right'>
            <span>{currentTime}</span>
            <span>{weather}</span>
            <span>{temperature}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)