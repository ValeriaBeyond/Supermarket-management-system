import React, { Component } from 'react'
import { Form, Icon, Input, Button, message } from 'antd'
import {Redirect} from 'react-router-dom'

import "./login.less"
import logo from '../../assets/images/logo.png'

import { reqLogin } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils';

class Login extends Component {

  handleSubmit = (event)=>{

    // 阻止表单的默认行为
    event.preventDefault()

    // 得到form对象：是一个具有强大功能的对象
    // const form  = this.props.form
    /** 
      getFieldDecorator()
      validateFields()
     */
    // 获取表单项的输入数据: values为对象：{key:value,....}形式
    // const values = form.getFieldsValue()
    // console.log(form)

    // 对所有表单字段进行检验： 
    this.props.form.validateFields(async (err, values) => {
      // 检验成功
      if(!err){
        // 提交登录的ajax请求
        console.log('校验成功')
        const {username, password} = values
        const result = await reqLogin(username, password) // {status: 0, data: user}  {status:1, msg:"xxx"}
        // console.log("请求成功", response.data)
        if(result.status === 0){
          // 登陆成功
          message.success('登陆成功') 

          // 保存当前用户信息到内存 和 local中
          const user = result.data
          memoryUtils.user = user
          storageUtils.saveUser(user)

          // 跳转到后台管理界面
              // push() 方法，是将新的界面添加到历史栈中
              // replace() 方法，是代替当前
          this.props.history.replace('/')

        } else{
          //登陆失败
          // 提示错误信息
          message.error(result.msg)
        }
      } else {
        console.log('校验失败')
      }
    })

  }

  // 对密码进行自定义校验
  validatePwd = (rule, value, callback)=>{
    console.log('validatePwd()', rule, value)
    if(!value){
      callback("密码必须输入")
    }else if(value.length<4){
      callback("密码长度不能小于4")
    }else if(value.length>12){
      callback("密码长度不能大于12")
    }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
      callback("密码只能包含字母、数字、下划线")
    }else{
      callback()
    }
  }
 
  render() {
    const user = memoryUtils.user
    if(user && user._id){   // 如果内存中存储了user的信息，则返回到项目的根路径
      return <Redirect to='/'/>
    }

    const form  = this.props.form
    const { getFieldDecorator } = form

    return (
      <div className='login'>
        <header className='login-header'>
          <img src={logo} alt="logo" />
          <h1>React项目：后台管理系统</h1>
        </header>
        <section className='login-content'>
          <h2>用户登录</h2>
           <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {/* // 第一个括号内两个参数：标识名称，配置对象 */}
              {getFieldDecorator('username', 
                {
                  // 声明式验证：直接使用别人定义好的验证规则进行验证
                  rules: [
                    { required: true, whitespace:true, message: '用户名必须输入!' },
                    { min: 4, message: '用户名至少4位!' },
                    { max: 12, message: '用户名至多12位!' },
                    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字、下划线!' }
                    // 以a-zA-Z-0-9_开头和结尾
                  ],
                  initialValue: 'admin',  // 设置用户名的初始值
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="用户名"
                  />,
                  )
              }
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(
                'password', 
                {
                  // 自定义验证：
                  rules: [
                    {
                      // validator: this.validatePwd
                    }
                  ],
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="Password"
                  />,
                  )
              }
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登陆
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    )
  }
}

/*
  包装Form组件生成一个新的组件： Form(Login)
  新组件会向Form组件传递一个强大的对象属性: form
*/
const WrapLogin = Form.create()(Login)
export default WrapLogin

/* 
  1. 高阶函数
    1). 一类特别的函数(两种类型)
      a 接收函数类型的参数
      b 返回值是函数
    2). 常见
      a. 定时器：setTimeout()/setInterval()
      b. Promise:Promise(()=>{}) then(value => {},reason => {}) 
      c. 数组遍历相关的方法：forEach()/filter()/map()/reduce()/find()/findIndex()
      d. 函数对象的bind() 
      e. Form.create()() / getFieldDecorator()()
    3). 高阶函数更加动态，更加具有扩展性

  2. 高阶组件
    1). 本质就是一个函数
    2). 接收一个组件（被包装组件），返回一个新的组件（包装组件），包装组件会向被包装组件传入特定属性
    3). 作用：扩展组件的功能
    4). 高阶组件也是高阶函数：接收一个组件函数，返回的是一个新的组件函数
*/
