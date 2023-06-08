import React, { Component } from 'react'
import {Card, Modal, Button, Table, message, } from 'antd'

import LinkButton from '../../components/link-button/linkButton'
import { reqAddUser, reqUserList,  reqUpdateUser, reqAddOrUpdateUser, reqDeleteUser } from '../../api'
import {PAGE_SIZE} from '../../utils/constants'
import Role from '../role/role'
import AddForm from './userAddUpdate'
import { formateDate } from '../../utils/dateUtiles'


/* 用户路由 */
export default class Users extends Component {
  state = {
    users:[],
    user:{},    // 当前操作行的用户
    roles:[],
    isShow: false,
    isShowDelete:false,
    isUpdate:false
  }

  ///？？？？？？？？？？？？？？？？？？？
  inintColums = ()=>{
    this.columns = [
      {
        title:'用户名',
        dataIndex: 'username'
      },
      {
        title:'邮箱',
        dataIndex: 'email'
      },
      {
        title:'电话',
        dataIndex: 'phone'
      },
      {
        title:'注册时间',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title:'所属角色',
        dataIndex: 'role_id',
        // render: (role_id)=>this.getRoleName(role_id)
        // render: (role_id) => this.state.roles.find((role)=>role._id===role_id).name
        render: (role_id) => this.roleNames[role_id]
        // 该方法只用一次遍历，效率较高。否则会为每一行都调用一次render方法
      },
      {
        title:'操作',
        render: (user)=> (
          <div>
            <LinkButton 
              onClick={()=>{
                this.setState({isShow:true, isUpdate:true})
                this.user = user
              }}
            >
              修改
            </LinkButton>
            <LinkButton 
              onClick={()=>{
                this.setState({isShowDelete:true})
                this.user = user
              }}
            >
              删除
            </LinkButton>
          </div>
        )
      },
    ]
  }

  /*
  getRoleName = (role_id) =>{
      const {roles} = this.state
      console.log('state.roleList:',roles)
      const list = roles.filter((role)=>role._id===role_id)
      console.log("list[0]:", list[0])
      return list[0].name
  }
  */

  // 根据role数组，生成包含所有角色名的对象（属性名用角色id值）
  initRoleNames = (roles)=>{
    const roleNames = roles.reduce((pre, role)=>{
      pre[role._id] = role.name
      return pre
    },{})
    this.roleNames = roleNames
  }

  getUsers = async ()=>{
    const result = await reqUserList()
    if(result.status === 0){
      const {users, roles} = result.data
      this.initRoleNames(roles)
      this.setState({users, roles})
    } else{
      message.error("获取用户列表失败")
    }
  }

  addOrUpdate = () =>{
    const {user} = this.state
        console.log("user", user)
    // 1.表单验证
    this.form.validateFields(async (error, values)=>{
      if(!error){
        // 2.隐藏确认框
        this.setState({isShow:false})
        
        // 3.取值
        const {username, phone, email, role_id} = values
        console.log("values:::", values)
        console.log("user._id:::", user._id)
        const new_user = {username, phone, email, role_id}

        if(user._id){   // 如果是更新
          this.setState({isUpdate:true})
          new_user._id = user._id
          new_user.password = user.password
        } 

        const result = await reqAddOrUpdateUser(new_user)
        // const result = await reqAddUser(new_user)
        if(result.status === 0){
          message.success((user._id?'更新':'添加')+'用户成功')
        } else{
          message.error((user._id?'更新':'添加')+'用户失败')
        }
        this.setState({user:{}})
        this.getUsers()
      }
    })
  }

  deleteUser = async ()=>{
    this.setState({isShowDelete:false})
    const result = await reqDeleteUser(this.user._id)
    if(result.status===0){
      message.success("删除用户成功")
    } else{
      message.error("删除用户失败")
    }
    this.getUsers()
  }

  onRow = (user) => {
    return { 
      onClick: event => {   // 点击行
        console.log("row onRow:", user)     // 打印一个对象
        this.setState({user})
      }
    }
  }

  componentWillMount(){
    this.inintColums()
  }

  componentDidMount(){
    this.getUsers()
  }
  
  render() {
    const title = (
      <Button type='primary' onClick={()=>{
        this.setState({ user:{}, isUpdate:false})
        this.setState((state)=>{
          state.isShow=true
          // console.log("this.state", this.state)
        })
      }}>创建用户</Button>
    )
    const {users, user, roles, isShow, isShowDelete, isUpdate} = this.state

    // console.log("roleNames---:", this.roleNames)
    return (
      <Card title={title}>
        <Table
          rowKey='_id'
          dataSource={users} 
          columns={this.columns} 
          bordered={true}  
          pagination={{defaultPageSize:PAGE_SIZE}}
          onRow={this.onRow}    // 设置行属性
        />
        
        <Modal
           title={isUpdate?'更新用户':'创建用户'}
          visible={isShow}
          onOk={this.addOrUpdate}
          onCancel={()=>{
            this.setState({isShow:false})
          }}  // 隐藏添加角色对话框}}
        >
          <AddForm 
            setForm={(form) => this.form = form}
            roles={roles}
            user = {user}
            isUpdate = {isUpdate}
          />
        </Modal>

        <Modal
          title="删除用户"
          visible={isShowDelete}
          onOk={this.deleteUser}
          onCancel={()=>this.setState({isShowDelete:false})}  // 隐藏添加角色对话框}}
        >
          你确定要删除该用户吗？
        </Modal>
      </Card>
    )
  }
}
