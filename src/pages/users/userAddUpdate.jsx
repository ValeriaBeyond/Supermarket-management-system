import React, { Component } from 'react'
import {Card, Form, Select, Input, Button} from 'antd'
import PropTypes from 'prop-types'


// 显示添加users的对话框
class UserAddUpdate extends Component {
    static propTypes = {
        setForm: PropTypes.func.isRequired,
    }

    UNSAFE_componentWillMount(){
        this.props.setForm(this.props.form)
        const {user} = this.props
        this.user = user
    }

    // 根据新传入的user来更新表单项的内容
    componentWillReceiveProps(nextProps){
        const {user} = nextProps
        this.user = user
    }

    render() {
        const {roles} = this.props
        const {user} = this
        const {role_id} = user
        const { getFieldDecorator } = this.props.form
        // 指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 4 },  // 左侧label的宽度
            wrapperCol: { span: 15 }, // 右侧包裹的宽度
        }
        // console.log('roleNames:', roleNames)
        // console.log('user111111:', user)
        return (
            <Form {...formItemLayout}>
                <Form.Item label='用户名'>
                    {
                        getFieldDecorator('username', {
                            initialValue:user.username,
                            rules:[
                                {required: true, message:'必须输入用户名'}
                            ]
                        })(<Input/>)
                    }
                </Form.Item>
                <Form.Item label='手机号'>
                    {
                        getFieldDecorator('phone', {
                            initialValue:user.phone,
                            rules:[
                                {required: true, message:'必须输入手机号'}
                            ]
                        })(<Input/>)
                    }
                    
                </Form.Item>
                <Form.Item label='邮箱'>
                    {
                        getFieldDecorator('email', {
                            initialValue:user.email,
                            rules:[
                                {required: false}
                            ]
                        })(<Input />)
                    }
                </Form.Item>
                <Form.Item label='角色'>
                    {
                        getFieldDecorator('role_id', {
                            initialValue:role_id,
                            rules:[
                                {required: true, message:'必须指定商品分类'},
                            ]
                        })(
                            <Select
                                placeholder="请选择所属角色"
                            >
                                {roles.map(role => (
                                    <Select.Option key={role._id}>{role.name}</Select.Option>
                                ))}
                            </Select>,    
                        )
                    }  
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create()(UserAddUpdate)