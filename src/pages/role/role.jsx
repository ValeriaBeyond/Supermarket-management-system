import React, { Component } from 'react'
import {Card, Table, Modal, Button, message} from 'antd'
import {PAGE_SIZE} from '../../utils/constants'

import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'
import AddForm from '../role/add_form'
import AuthForm from '../role/auth_form'
import memoryUtils from '../../utils/memoryUtils'
import {formateDate} from '../../utils/dateUtiles'

/* 角色管理路由 */
export default class Role extends Component {

  state = {
    roles:[],   // 所有角色列表
    role:{},    // 当前选中的角色
    isShowAdd: false,    //是否显示添加界面对话框
    isShowAuth: false,   // 是否显示更新角色权限的对话框
  }

  constructor(props){
    super(props)
    this.auth = React.createRef()
  }

  initColumns = ()=>{
    this.columns = [
      {
        title:'角色名称',
        dataIndex:'name'
      },
      {
        title:'创建时间',
        dataIndex:'create_time',
        render: (create_time)=> formateDate(create_time)
      },
      {
        title:'授权时间',
        dataIndex:'auth_time',
        render: formateDate
      },
      {
        title:'授权人',
        dataIndex:'auth_name'
      }
    ]
  }

  getRoles = async () => {
    const result = await reqRoles()
    if(result.status === 0){
      const roles = result.data
      this.setState({roles})
    }
  }

  onRow =(role)=>{    // 这里的role是当前选中的行的对象
    return {
      onClick: event => {   // 点击行
        console.log("row onRow:", role)     // 打印一个对象
        this.setState({role})
      }
    }
  }

  // 添加角色时点击确定时的回调
  addRole = ()=>{
    // 1.表单检验
    this.form.validateFields(async (error, values)=>{
      if(!error){
        // 2.隐藏确认框
        this.setState({isShowAdd:false})

        //3.获取输入框的values ---> 因为 getFieldDecorator('roleName', {})
            // 第一个参数为values的属性名 ，属性值为输入框的内容
            // 第二个参数为配置项：配置 initialValue:''    ;  rules:[]
              // console.log('values:',values)
              // values: { roleName: 'xxxx' }
        const {roleName} = values

        // 4.清空输入框数据，以访下次添加时会显示本次输入的数据
        this.form.resetFields()

        // 5.发送请求
        const result = await reqAddRole(roleName)
        if(result.status === 0){
              // console.log("result.data:",result.data)
              // result.data: {menus: Array(0), _id: '6464614674878767c844bb4c', name: 'role', create_time: 1684300102071, __v: 0}
          // 6.获取请求返回来的数据
          const role = result.data

          // 7.更新角色状态
              // 方法1：这里在原有状态的基础上，重新生成一个新的角色数组
                // setState参数可以是 一个回调函数，回调函数参数为原先的state
            this.setState(state => ({
            roles: [...state.roles, role]
          }))
        }
              // 方法2
            /*
              const roles = [...this.state.roles]
              roles.push(role)
              this.setState({roles})
            */
      } else{
        message.error("添加角色失败")
      }
    })
  }

  // 更新角色时点击确定时的回调函数
  updateRole = async ()=>{
    // 2.隐藏确认框
    this.setState({isShowAuth:false})
    
    const role = this.state.role
    // 得到最新的menus
        /* 
          父组件向子组件传递 ref={this.auth}, 父组件就可以使用this.auth.current 来调用子组件中的方法 
        */
    const menus = this.auth.current.getMenus()
    role.menus = menus
    role.auth_name = memoryUtils.user.username  // 当前登陆的角色名
    role.auth_time = Date.now()

    // 请求更新 ===>  后台该请求函数会自动改变 roles 内对应的role
    const result = await reqUpdateRole(role)
    if(result.status === 0){
      message.success('更新角色权限成功')
      this.setState({
        roles: [...this.state.roles]
      })
    } else{
      message.error('更新角色权限失败')
    }
  }

  componentWillMount(){
    this.initColumns()
  }

  componentDidMount(){
    this.getRoles()
  }

  render() {
    const {roles, role, isShowAdd, isShowAuth} = this.state
    const title = (
      <span>
        <Button type='primary' onClick={()=>this.setState({isShowAdd:true})}>创建角色</Button>&nbsp;&nbsp;
        <Button type='primary' disabled={!role._id} onClick={()=>this.setState({isShowAuth:true})}>设置角色权限</Button>
      </span>
    )
    return (
      <Card title={title}>
          <Table 
            rowKey='_id'
            dataSource={roles} 
            columns={this.columns} 
            bordered={true}  
            pagination={{defaultPageSize:PAGE_SIZE}}
            rowSelection={{
              type:'radio', 
              selectedRowKeys:[role._id],
              onSelect:(role)=>{
                this.setState({role})
              }
            }}
            onRow={this.onRow}    // 设置行属性
          />
          <Modal
            title="添加角色"
            visible={isShowAdd}
            onOk={this.addRole}
            onCancel={()=>{
              this.setState({isShowAdd:false})  // 隐藏添加角色对话框
              this.form.resetFields()           // 清空输入框内容
            }}
          >
            <AddForm 
              setForm={(form) => this.form = form}
            />
          </Modal>
          <Modal
            title="更新角色"
            visible={isShowAuth}
            onOk={this.updateRole} 
            onCancel={()=>{
              this.setState({isShowAuth:false})
            }}
          >
            {/* 当点击不同的角色进行权限设置时，会给子组件传递不同的role
                利用父组件状态的改变，在子组件中使用componentWillReceiveProps(){} 更新不同的checkedKeys
            */}
            <AuthForm role = {role} ref={this.auth} />
          </Modal>
      </Card>
    )
  }
}
