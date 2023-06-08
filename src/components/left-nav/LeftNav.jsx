import React, { Component } from 'react'
import {NavLink, withRouter} from 'react-router-dom'
import { Menu, Icon, Button } from 'antd';

import './index.less'
import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig';
import Item from 'antd/lib/list/Item';

const { SubMenu } = Menu;

class LeftNav extends Component {
    /*  
    根据menu的数据数组生成对应的标签数组
    数组的 map() 方法和递归调用
    */
    getMenuNodes_map = (menuList)=>{
        return menuList.map(item =>{
            if(!item.children){
                return (
                    <Menu.Item key={item.key}>
                        <NavLink to={item.key}>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </NavLink>
                    </Menu.Item>
                )
            } else{
                return (
                    <SubMenu
                        key={item.key}
                        title={
                        <span>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </span>
                        }
                    >
                        {
                            this.getMenuNodes(item.children)
                        }
    
                    </SubMenu>
                )
            }
        })
    }

    getMenuNodes = (menuList)=>{
        // 获取当前选中的路由组件的路径
        const path = this.props.location.pathname
        
        return menuList.reduce((pre, item)=>{
            if(!item.children){
                pre.push((
                    <Menu.Item key={item.key}>
                        <NavLink to={item.key}>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </NavLink>
                    </Menu.Item>
                ))
            } else{
                // 判断该组件的子组件的路径是否 与 当前选中的路径相同
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                if(cItem){  // 找到相同的则赋值给openKey，给后面 defaulOpenKey传值
                    this.openKey = item.key
                }
                pre.push((
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </span>
                        }
                    >
                        {   // 递归调用该函数，生成二级子导航菜单
                            this.getMenuNodes(item.children)
                        }
                    </SubMenu>
                ))
            }
            return pre
        }, [])
    }

    componentWillMount(){
        this.menuNodes = this.getMenuNodes(menuList)
    }

  render() {
    // 接收当前选中的路由组件的路径
    let path = this.props.location.pathname
    // 如果当前路径是以'/product'开头的，则
    if(path.indexOf('/product') === 0){
        path = '/product'
    }

    const openKey = this.openKey

    return (
        <div className='left-nav'> 
            <NavLink to='/' className='left-nav-header'>
                <img src={logo} alt="logo" />
                <h1>我的后台</h1>
            </NavLink>

            <Menu
                selectedKeys={[path]}
                defaultOpenKeys={[openKey]}
                mode="inline"
                theme="dark"
                // inlineCollapsed={this.state.collapsed}
            >

            {
                this.menuNodes
            }
{/*这里是原先直接写各导航标签的写法*/}
<div>
            {/* 
                <Menu.Item key="/home">
                    <NavLink to='/home'>
                        <Icon type="pie-chart" />
                        <span>首页</span>
                    </NavLink>
                </Menu.Item>
                <SubMenu
                    key="sub1"
                    title={
                    <span>
                        <Icon type="mail" />
                        <span>商品</span>
                    </span>
                    }
                >
                    <Menu.Item key="/category">
                        <NavLink to='/category'>
                            <Icon type="mail" />
                            <span>品类管理</span>
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="/products">
                        <NavLink to='/products'>
                            <Icon type="mail" />
                            <span>商品管理</span>
                        </NavLink>
                    </Menu.Item>
                </SubMenu>
                <Menu.Item key="/users">
                    <NavLink to='/users'>
                        <Icon type="pie-chart" />
                        <span>用户管理</span>
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="/role">
                    <NavLink to='/role'>
                        <Icon type="pie-chart" />
                        <span>角色管理</span>
                    </NavLink>
                </Menu.Item>

                <SubMenu
                    key="sub2"
                    title={
                    <span>
                        <Icon type="mail" />
                        <span>图形图标</span>
                    </span>
                    }
                >
                    <Menu.Item key="/charts/bar">
                        <NavLink to='/charts/bar'>
                            <Icon type="mail" />
                            <span>柱形图</span>
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="/charts/line">
                        <NavLink to='/charts/line'>
                            <Icon type="mail" />
                            <span>折线图</span>
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="/charts/pie">
                        <NavLink to='/charts/pie'>
                            <Icon type="mail" />
                            <span>饼图</span>
                        </NavLink>
                    </Menu.Item>
                </SubMenu> 
            */}
</div>
            </Menu>
        </div>
    )
  }
}

export default withRouter(LeftNav)
