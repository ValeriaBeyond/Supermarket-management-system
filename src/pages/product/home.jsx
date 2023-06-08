import React, { Component } from 'react'
import {Card, Table, Select, Input, Button, Icon, message} from 'antd'

import LinkButton from '../../components/link-button/linkButton'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'

const Option = Select.Option
export default class ProductHome extends Component {
    state={
        total:0,        // 总共的商品数量
        products:[],    // 商品列表
        loading:false,  // 是否正在加载中
        searchName:'',  // 搜索的关键字名称
        searchType:'productName',  // 根据哪个字段搜索:默认按名称进行搜索
    }

    // 初始化table列的数组
    initColums =()=>{
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price)=> '￥'+price
            },
            {
                title: '状态',
                // dataIndex: 'status',
                width:100,
                render: (product)=> {
                    const { _id, status} = product
                    return (
                        <span>
                            <Button 
                                type='primary' 
                                onClick={() => this.updateStatus(_id, status===1?2:1)}
                            >
                                {status===1?'下架':'上架'}
                            </Button>
                            {status===1?'在售':'已下架'}
                        </span>
                    )
                }
            },
            {
                title: '操作',
                width:100,
                render: (product)=> {
                    return (
                        <span >
                             {/* 将product对象使用state传递给目标路由组件， 取该属性时，可以先 */}
                            <LinkButton onClick={()=> this.props.history.push('/product/detail', {product})}>详情</LinkButton>
                            <LinkButton onClick={()=> this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
                        </span>
                    )
                }
            },
          ];
    }

    // 更新指定商品的状态
    updateStatus = async (_id, status)=>{
        const result = await reqUpdateStatus(_id, status)
        if(result.status===0){
            message.success('更新商品成功')
            this.getProducts(this.pageNum)
        }
    }

    // 获取指定页码的列表数据显示
    getProducts = async (pageNum)=>{
        this.pageNum = pageNum      // 保存当前所在页码， 方便其他方法使用
        this.setState({loading:true})       // 显示loading

        const {searchName, searchType} = this.state
        let result
        // 如果搜索关键字有值，则是搜索分页
        if(searchName){
            result = await reqSearchProducts({
                pageNum:pageNum, 
                pageSize:PAGE_SIZE, 
                searchName: searchName,
                searchType:searchType
            })
        } else{
            // searchName无值，则显示普通分页
            result = await reqProducts(pageNum, PAGE_SIZE)

        }
        this.setState({loading:false})      // 隐藏loading
        if(result.status===0){
            const {total, list} = result.data
            this.setState({
                total:total,
                products:list
            })
        }
    }

    componentWillMount(){
        this.initColums()
    }

    componentDidMount(){
        this.getProducts(1)
    }
    
    render() {
        const {products, total, loading, searchType, searchName} = this.state

        const title=(
            <span>
                <Select 
                    value={searchType} 
                    style={{width:150}} 
                    onChange={value => this.setState({searchType:value})}
                >
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='ProductDesc'>按描述搜索</Option>
                </Select>
                <Input 
                    placeholder='关键字' 
                    style={{width:150, margin:'0 15px'}} 
                    value={searchName}
                    onChange={event => this.setState({searchName:event.target.value})}
                />
                <Button type='primary' onClick={()=> this.getProducts(1)}>搜索</Button>
            </span>
        )

        const extra=(
            <Button type='primary' onClick={()=> this.props.history.push('/product/addupdate')}>
                <Icon type='plus'/>
                添加商品
            </Button>
        )

        return (
        <Card title={title} extra={extra}>
            <Table 
                bordered
                rowKey='_id'
                loading={loading}
                dataSource={products} 
                columns={this.columns} 
                pagination={{
                    total, 
                    defaultPageSize:PAGE_SIZE, 
                    showQuickJumper:true,
                    onChange: this.getProducts,
                }}
            />
        </Card>
        )
    }
}
