import React, { Component } from 'react'
import {Form, Select, Input, Tree} from 'antd'
import PropTypes from 'prop-types'

import menuList from '../../config/menuConfig'

/**
 * 
 * 在本组件设置了自身的状态checkedKeys（数组）保存当前被勾选的选项。
 * - 在constructor(){} 用 当前角色的menus属性 初始化 checkedKeys 
 * - Tree组件中有属性 checkedKeys , onCheck 
 *      当点击多选框时，触发onCheck的回调函数（自编写）
 *          在该回调函数中，更新状态中的 checkedKeys
 * - 点击 确定按钮 事件则是在父组件role中进行处理
 *  
 * 
 */
const { TreeNode } = Tree
// 显示添加角色的对话框
export default class AuthForm extends Component {
    static propTypes = {
        // 接收父组件传递过来的 object类型的属性：当前被选中的要进行权限设置的唯一的角色
        role: PropTypes.object      
    }

    constructor(props){
        super(props)
        // 根据传入角色的menus生成初始状态
        const {menus} = this.props.role
        this.state = {
            checkedKeys: menus
        }
    }

    // 为父组件提供获取最新menus数据的方法
    getMenus = () => this.state.checkedKeys

    getTreeNodes =(menuList)=>{
        return menuList.reduce((pre, item)=>{
            pre.push(
                <TreeNode title={item.title} key={item.key}>
                    {item.children ? this.getTreeNodes(item.children) : null}
                </TreeNode>
            )
            return pre
        } ,[])
    }

    /** Tree 的onCheck 属性的回调函数：传递两个参数： 1.checkedKeys   2. 事件的详细信息对象
     *  第二个参数可以省略
     */
    onCheck = (checkedKeys, info) => {      // 设置角色权限时，选中多选框时的回调
        console.log('onCheck--checkedKeys:', checkedKeys);
        console.log('onCheck--info', info);

        this.setState({ checkedKeys });
    }

    componentWillMount(){
        this.treeNodes = this.getTreeNodes(menuList)
    }

    // 第一次点击取消后，更换role后其权限仍显示上一个role的权限
    // 根据新传入的role更新checkedKeys
    // 组件接收到新属性时自动调用
    componentWillReceiveProps(nextProps){
        console.log('componentWillReceiveProps()', nextProps)
        const menus = nextProps.role.menus
        this.setState({
            checkedKeys: menus
        })
    }

    render() {
        console.log('AuthForm-render()')

        const {role} = this.props
        const {checkedKeys} = this.state

        // 指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 4 },  // 左侧label的宽度
            wrapperCol: { span: 15 }, // 右侧包裹的宽度
        }
        return (
        <div>
            {/* label 是 */}
            <Form.Item label='角色名称' {...formItemLayout}>    
                <Input value={role.name} disabled/>
            </Form.Item>

{/* Tree 的onCheck 属性本质为函数，传递两个参数： 1.checkedKeys   2. 事件的详细信息对象 */}
            <Tree
                checkable
                defaultExpandAll={true}
                checkedKeys={checkedKeys}
                onCheck={this.onCheck}    
            >
                {/* 根节点 */}
                <TreeNode title="平台权限" key="all">   
                    {this.treeNodes}
                </TreeNode>
            </Tree>
        </div>
        )
    }
}