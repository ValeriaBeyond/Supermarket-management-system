import React, { Component } from 'react'
import { Card, Icon, Button, Table, message, Modal } from 'antd'

import LinkButton from '../../components/link-button/linkButton'
import { reqAddCategory, reqCategories, reqUpdateCategory } from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'


/* 商品分类路由 */
export default class Category extends Component {
  state = {
    categories:[],     // 一级分类列表
    subCategories:[],  // 子分类列表
    isLoading:false,   // 是否正在获取数据中
    parentId:'0',     // 当前需要显示的分类列表的父分类ID
    parentName:'',    // 当前需要显示的分类列表的父分类名称
    showStatus:0,     // 表示添加/更新的确认框是否显示。0：隐藏， 1：添加， 2：更新
  }

  // 初始化Table所有列的数组
  initColumns = ()=> {
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name',   // 显示数据对应的属性名
      },
      {
        title: '操作',
        width:300,  
        // catrgory是每一行对应的分类对象
        render: (category) => (   // 返回需要显示的界面标签
          <span>
            <LinkButton onClick={()=>{this.showUpdate(category)}}>修改分类</LinkButton>
            {this.state.parentId==='0'
              ?<LinkButton onClick={()=>{this.showSubCategories(category)}}>查看子分类</LinkButton>
              :null}
            
          </span>
        ),
      }
    ]
  }

  // 异步获取一级/二级分类列表
  getCategories = async(parentId)=>{
    this.setState({isLoading:true})     // 发送请求前，显示loading

    // parentId 的值：如果有parentId参数传入，则为参数值否则为当前状态的parentId的值
    parentId = parentId || this.state.parentId
    const result = await reqCategories(parentId)
    this.setState({isLoading:false})    // 发送请求后，隐藏loading

    if(result.status === 0){  
      const categories = result.data      // 取出分类数组（一级/二级）
      if(parentId==='0'){     // 更新一级分类状态
        this.setState({     
          categories: categories
        })
      }else{                  // 更新二级分类状态
        this.setState({     
          subCategories: categories
        })
      }
      // console.log('categories',categories)
    } else{
      message.error('获取分类列表失败')
    }
  }

  // 显示指定一级分类对象的二级子列表
  showSubCategories(category){
    this.setState({
      parentId:category._id,
      parentName:category.name
    }, ()=>{
      console.log('parentId', this.state.parentId)
      // 获取二级分类列表
      this.getCategories()
    })
    // console.log('parentId', this.state.parentId)  // '0'

    
  }

  // 显示一级分类列表
  showCategories = ()=>{
    this.setState({
      // 更新为显示一级列表的状态
      parentId:'0',
      parentName:'',
      subCategories:[],
    })
  }

  // 相应点击取消：隐藏确定框
  handleCancel =()=>{
    // 清除输入数据缓存
    this.form.resetFields()
    // 隐藏确认框
    this.setState({
      showStatus:0
    })
  }

  // 添加分类
  addCategory = ()=>{
    console.log('addCategory')
    // 表单验证
    this.form.validateFields(async (err, values)=>{
      if(!err){
        // 1.隐藏对话框     
        this.setState({
          showStatus:0
        })
        // 准备数据: 属性就是getFieldDecorator（）第一个参数的标识名称
        const {parentId, categoryName} = values
        // 2.发送请求添加分类
        const result = await reqAddCategory(categoryName, parentId)
        // 清除数据缓存
        this.form.resetFields()
        // 3.重新获取分类列表显示
        if(result.status===0){
          if(parentId===this.state.parentId){     // 只有在当前父分类下添加当前父分类的子分类才重新获取，否则没必要
            this.getCategories()
          } else if(parentId==='0'){
            this.getCategories('0')
          }
        }
      }
    })
  }

  // 显示添加分类的对话框:更新showStatus的状态
  showAdd =()=>{
    this.setState({
      showStatus:1
    })
  }

  // 更新分类
  updateCategory = ()=>{
    console.log('updateCategory')
    // 进行表单验证
    this.form.validateFields(async (err, values)=>{
      if(!err){
        // 1.隐藏对话框     
        this.setState({
          showStatus:0
        })

        // 准备数据
        const categoryId = this.category._id
        const {categoryName} = values
        // 清除输入数据的缓存：避免
        this.form.resetFields()

        // 2.发送请求更新分类
        const result = await reqUpdateCategory({categoryId, categoryName})
        if (result.status===0){
          // 3.重新显示列表
          this.getCategories()
        }
      }
    })  
  }

  // 显示更新分类的对话框
  showUpdate =(category)=>{
    // 保存传入的分类对象
    this.category = category
    // 更新状态
    this.setState({
      showStatus:2
    })
  }


  componentWillMount(){
    this.initColumns()
  }

  componentDidMount(){
    // 获取一级分类列表显示
    this.getCategories()
  }

  render() {
    // 读取状态数据
    const {categories, isLoading, subCategories, parentId, parentName, showStatus} = this.state   
    // 读取指定的分类
    const category = this.category || {}

    const title = parentId==='0'?'一级分类列表': (
      <span>
        <LinkButton onClick={this.showCategories}>一级分类列表</LinkButton>
        <Icon type='arrow-right'> </Icon>
        <span>{parentName}</span>
      </span>
    )
    const extra = (
      <Button type='primary' onClick={this.showAdd}>
        <Icon type='plus'/>
        添加
      </Button>
    )
    return (
      <Card title={title} extra={extra}>
        {/* bordered 带分割线的表格 */}
        <Table 
          dataSource={parentId==='0' ? categories : subCategories} 
          columns={this.columns} 
          bordered={true}  
          pagination={{defaultPageSize:5, showQuickJumper:true}}
          loading={isLoading}
        />;

        <Modal
          title="添加分类"
          visible={showStatus===1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddForm 
            categories={categories}
            parentId={parentId}
            setForm={(form)=>{this.form=form}}
          />
        </Modal>

        <Modal
          title="更新分类"
          visible={showStatus===2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          <UpdateForm 
            categoryName={category.name} 
            setForm={(form)=>{this.form=form}}/>
        </Modal>

      </Card>
    )
  }
}
