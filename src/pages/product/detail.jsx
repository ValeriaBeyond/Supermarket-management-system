import React, { Component } from 'react'
import { Card,  List, Icon, } from 'antd'

import LinkButton from '../../components/link-button/linkButton'
import { reqCategory } from '../../api'
import { BASE_IMG_URL } from '../../utils/constants'

const Item = List.Item
export default class ProductDetail extends Component {
  state={
    cName1:'',  // 一级分类名称
    cName2:'',  // 二级分类名称
  }

  async componentDidMount(){
    const {pCategoryId, categoryId} = this.props.location.state.product
    if(pCategoryId==='0'){  // 一级分类下的商品
      const result = await reqCategory(categoryId)
      const cName1 = result.data.name
      this.setState({cName1})
    } else{
      /* 通过多个await方式发送多个请求： 后面的请求是在前一个请求成功返回后才发送,效率低下 */
      // const result1 = await reqCategory(pCategoryId)
      // const result2 = await reqCategory(categoryId)
      // const cName1 = result1.data.name
      // const cName2 = result2.data.name

      // 一次性发送多个请求，只有都成功了，才正常处理
      const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
      const cName1 = results[0].data.name
      const cName2 = results[1].data.name

      this.setState({cName1, cName2})
    }
  }

  render() {
    // imgs是一个字符串数组，字符串内容为图片地址
    const { name, desc, price, imgs, detail } = this.props.location.state.product
    const {cName1, cName2} = this.state

    const title = (
      <span>
        <LinkButton>
          <Icon 
            type='arrow-left' 
            style={{fontSize:20, marginRight: 10}}
            onClick={()=> this.props.history.goBack()}
          />
        </LinkButton>
        商品详情
      </span>
    )

    return (
      <Card title={title} className='product-detail'>
        <List>
          <Item className='product-detail-item'>
            <span className='left'>商品名称：</span>
            <span>{name}</span>
          </Item>
          <Item className='product-detail-item'>
            <span className='left'>商品描述：</span>
            <span>{desc}</span>
          </Item>
          <Item className='product-detail-item'>
            <span className='left'>商品价格：</span>
            <span>{price}元</span>
          </Item>
          <Item className='product-detail-item'>
            <span className='left'>所属分类：</span>
            <span>{cName1} {cName2 ? '-->'+{cName2} : ''}</span>
          </Item>
          <Item className='product-detail-item'>
            <span className='left'>商品图片：</span>
            <span >
              { // 遍历图片数组
                imgs.map(img => (
                  <img
                    style={{width:300}}
                    key={img}
                    src={BASE_IMG_URL + img}
                    className='product-img'
                    alt='img'
                  />
                ))
              }
            </span>
          </Item>
          <Item className='product-detail-item'>
            <span className='left'>商品详情：</span>
            <span dangerouslySetInnerHTML={{__html:detail}}></span>
          </Item>
        </List>
      </Card>
    )
  }
}
