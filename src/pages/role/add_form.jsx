import React, { Component } from 'react'
import {Form, Select, Input} from 'antd'
import PropTypes from 'prop-types'


// 显示添加角色的对话框
class AddForm extends Component {
    static propTypes = {
        setForm: PropTypes.func.isRequired,
    }

    componentWillMount(){
        this.props.setForm(this.props.form)
        console.log("role-this.props.form: ",this.props.form)
    }

    render() {
        const { getFieldDecorator } = this.props.form
        // 指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 4 },  // 左侧label的宽度
            wrapperCol: { span: 15 }, // 右侧包裹的宽度
        }
        return (
        <Form>
            {/* label 是 */}
            <Form.Item label='角色名称' {...formItemLayout}>    
                {
                    getFieldDecorator('roleName',{
                        initialValue:'',
                        rules:[
                            {required: true, message: '角色名称必须输入'}
                        ]
                    })(
                        <Input placeholder='请输入角色名称'/>
                    )
                }
            </Form.Item>
        </Form>
        )
    }
}

export default Form.create()(AddForm)