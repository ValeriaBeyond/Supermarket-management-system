import React, { Component } from 'react'
import { Card, Input, Icon, Button, Form, Select, Cascader, message } from 'antd'

import LinkButton from '../../components/link-button/linkButton'
import {reqCategories, reqAddCategory, reqAddOrUpdateProduct} from '../../api/index'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'

const {TextArea} = Input
const {Item} = Form


class ProductAddUpdate extends Component {
    state={
        options:[],
    }

    constructor(props){
        super(props)

        // 创建用来保存ref标识的标签对象的容器
        this.pw = React.createRef()
        this.editor = React.createRef()
    }


    submit = ()=>{
        // 进行表单验证，验证通过才发送请求
        this.props.form.validateFields(async (error, values)=>{
            if(!error){
                // 1. 收集数据，并封装成product对象
                const {name, desc, price, categoryIds } = values
                let pCategoryId, categoryId
                if(categoryIds.length === 1){
                    pCategoryId = '0'
                    categoryId = categoryIds[0]
                } else{
                    pCategoryId = categoryIds[0]
                    categoryId = categoryIds[1]
                }

                // 收集上传的图片数据
                    // this.pw.current获取到父组件需要用到方法的子组件标签对象，从而实现父组件调用子组件的方法
                const imgs = this.pw.current.getImgs()
                // 收集富文本框内文档（以html格式）
                const detail = this.editor.current.getDetail()
                
                let categoryName = name
                let parentId = pCategoryId

                const product = {name, desc, price, imgs, detail, categoryName, parentId}

                // 如果是更新， 需要添加 _id
                if(this.isUpdate){
                    product._id = this.product._id
                }

                // 2. 调用接口请求函数去添加/更新
                const result = await reqAddOrUpdateProduct(product)

                // 3. 根据结果提示
                if(result.status === 0){
                    message.success(`${this.isUpdate ? '更新':'添加'}商品成功`)
                    this.props.history.goBack()
                } else{
                    message.error(`${this.isUpdate ? '更新':'添加'}商品失败`)
                    
                }
            }
        })
    }

    // 验证价格的自定义验证函数
    validatePrice =(rule, value, callback)=>{
        if(value*1 > 0){
            callback()  // 验证通过
        } else{
            callback('价格必须大于0')   // 验证没通过
        }
    }

    // 异步获取一级/二级分类列表，并显示
    getCategories = async (parentId)=>{
        const result = await reqCategories(parentId)
        if(result.status === 0){
            const categories = result.data      
            /* 是一个对象数组
              [{parentId: '0', _id: '644e05835d05ae59300ad969', name: '蔬菜类', __v: 0},{},....]
            */
            console.log('categories:', categories)
            if(parentId === '0'){       // 请求一级列表时，才调用函数：生成新的数组对象并更新状态
                this.initOptions(categories)
            } else{
                return categories
            }
        }
    }

    initOptions = async (categories)=>{
        // 生成新的数组对象
        const options = categories.map(c=>({
            value: c._id,
            label: c.name,
            isLeaf: false,
        }))

        const {isUpdate, product} = this
        const {pCategoryId} = product
        // 如果是更新操作， 且是二级列表的更新
        if(isUpdate && pCategoryId!=='0'){
            // 获取对应的二级分类列表
            const subCategories = await this.getCategories(pCategoryId)
            // 生成二级下拉列表的options
            const childOtions = subCategories.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            // 找到当前商品对应的一级option对象
            const targetOption = options.find(option => option.value===pCategoryId)

            // 关联对应的一级option上
            targetOption.children = childOtions
        }
 
        // 更新状态
        this.setState({
            options:options
        })
    }

    loadData = async (selectedOptions) => {
        // 由于该项目中是单选框，所以selectedOptions是一个只有一个元素的数组，该元素是一个关于被选中选项的对象
        // 当第一级列表的选项被选中时，selectedOptions
        console.log(selectedOptions)
        /**
         * Array(1)
         * 0: {value: 'zhejiang', label: 'Zhejiang', isLeaf: false, loading: false, children: Array(2)}
         * length: 1
         */
        const targetOption = selectedOptions[0]
        targetOption.loading = true

        // 根据选中的分类，请求获取二级分类列表
        const subCategories = await this.getCategories(targetOption.value)
        // 隐藏loading
        targetOption.loading = false;
        
        // 二级分类数组有数据
        if(subCategories && subCategories.length >0 ){
            // 生成二级列表的options
            targetOption.children = subCategories.map(c=>({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
        } else{     // 当前选中的分类没有二级分类
            targetOption.isLeaf = true
        }

        // 更新options状态
        this.setState({
            options:[...this.state.options],
        })
    }

    componentWillMount(){
        // 取出携带的state：如果是添加，则product为{}空对象
                        // 如果是修改，则product有值
        const product = this.props.location.state       // 当前表单的内容
        console.log('this.props.location:',this.props.location)
        // 保存是否是更新的标识
        this.isUpdate = !!product   // !!强制转换成bool类型
        this.product = product || {}    
    }

    componentDidMount(){
        this.getCategories('0')
    }

    render() {
        const {isUpdate, product} = this
        // console.log("product:", product)
        // console.log("isUpdate:", isUpdate)

        const {categoryId, pCategoryId, detail, imgs} = product
        // console.log('categoryId:',categoryId)
        // console.log('pCategoryId:',pCategoryId)
        // 用于接收级联分类ID的数组
        const categoryIds = []
        if(isUpdate){
        // 如果是修改
            if(pCategoryId==='0'){
                // 商品是一个一级分类的商品
                categoryIds.push(categoryId)
            } else{
                // 商品是一个二级分类的商品
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        } 

        const formItemLayout = {
            labelCol:   { span:2 },     // 左侧lable的宽度  ：共24列
            wrapperCol: { span:8 },     // 右侧输入框的宽度
        }

        const title = (
            <span>
                <LinkButton onClick={()=>this.props.history.goBack()}>
                    <Icon type='arrow-left' style={{fontSize:20}}/>
                </LinkButton>
                {isUpdate?'修改商品':'添加商品'}
            </span>
        )

        // getFieldDecorator('',{})(<></>)用于收集表单数据
        const {getFieldDecorator} = this.props.form
        return (
        <Card title={title}>
            <Form {...formItemLayout}>
                <Item label='商品名称'>
                    {
                        getFieldDecorator('name', {
                            initialValue:product.name,
                            rules:[
                                {required: true, message:'必须输入商品名称'}
                            ]
                        })(<Input/>)
                    }
                </Item>
                <Item label='商品描述'>
                    {
                        getFieldDecorator('desc', {
                            initialValue:product.desc,
                            rules:[
                                {required: true, message:'必须输入商品描述'}
                            ]
                        })(<TextArea autoSize={{ minRows: 2 }} />)
                    }
                    
                </Item>
                <Item label='商品价格'>
                    {
                        getFieldDecorator('price', {
                            initialValue:product.price,
                            rules:[
                                {required: true, message:'必须输入商品描述'},
                                {validator: this.validatePrice}
                            ]
                        })(<Input type='number' addonAfter='元'/>)
                    }
                </Item>
                <Item label='商品分类'>
                    {
                        getFieldDecorator('categoryIds', {
                            initialValue:categoryIds,    // 收集的数据是一个包含了级联列表的ID的数组
                            rules:[
                                {required: true, message:'必须指定商品分类'},
                            ]
                        })(
                            <Cascader
                            placeholder='请指定商品分类'
                                options={this.state.options}       // 需要显示的一级列表数组数据
                                loadData={this.loadData}           // 加载选中的Option的二级列表
                            />    
                        )
                    }   
                </Item>
                <Item label='商品照片'>
                    {/* pw 是在constructor函数中定义的用来保存具有ref标识的标签对象的容器 */}
                    {/* 具有ref属性的组件，会将自己的实例对象放到this.pw容器中 */}
                     
                    <PicturesWall ref={this.pw} imgs={imgs} /> 
                </Item>
                <Item label='商品细节' labelCol={{ span:2 }} wrapperCol={{span:20}}>
                    <RichTextEditor ref={this.editor} detail={detail}/>
                </Item>
                <Item>
                    <Button type='primary' onClick={this.submit}>提交</Button>
                </Item>
            </Form>
        </Card>
        )
    }
}

export default Form.create()(ProductAddUpdate)

