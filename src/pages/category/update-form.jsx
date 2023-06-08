import React, { Component } from 'react'
import {Form, Input} from 'antd'
import PropTypes from 'prop-types'

// const Item = Form.Item
// const Option = Select.Option

// 显示更新组件的对话框
class UpdateForm extends Component {

    static propTypes = {
        categoryName : PropTypes.string.isRequired,
        setForm : PropTypes.func.isRequired
    }

    componentDidMount(){
        // 将from对象通过该方法传递给父组件
        this.props.setForm(this.props.form)
    }

    render() {
        const {categoryName} = this.props
        const { getFieldDecorator } = this.props.form
        return (
        <Form>
            <Form.Item>
                {
                    getFieldDecorator('categoryName',{
                        initialValue:categoryName,
                        rules:[
                            {required: true, message: '分类名称必须输入'}
                        ]
                    })(
                        <Input placeholder='请输入分类名称'/>
                    )
                }
            </Form.Item>
        </Form>
        )
    }
}

export default Form.create()(UpdateForm)