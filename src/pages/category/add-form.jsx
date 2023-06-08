import React, { Component } from 'react'
import {Form, Select, Input} from 'antd'
import PropTypes from 'prop-types'

// const Item = Form.Item
// const Option = Select.Option

// 显示添加组件的对话框
class AddForm extends Component {
    static propTypes = {
        setForm: PropTypes.func.isRequired,
        categories: PropTypes.array.isRequired,     // 一级分类的数组
        parentId: PropTypes.string.isRequired,      // 父分类的ID
    }

    componentWillMount(){
        this.props.setForm(this.props.form)
    }

    render() {
        const {categories, parentId} = this.props
        const { getFieldDecorator } = this.props.form
        return (
        <Form>
            <Form.Item>
                {
                    getFieldDecorator('parentId',{
                        initialValue:parentId
                    })(
                        <Select>
                            <Select.Option value='0'>一级分类</Select.Option>
                            {
                                categories.map(c => <Select.Option value={c._id}>{c.name}</Select.Option>)
                            }
                        </Select>
                    )
                }
            </Form.Item>
            <Form.Item>
                {
                    getFieldDecorator('categoryName',{
                        initialValue:'',
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

export default Form.create()(AddForm)