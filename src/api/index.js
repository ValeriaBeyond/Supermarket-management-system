/**
 * 要求：能根据接口文档定义接口请求
 * 包含应用中所有请求函数的模块
 * 每个函数的返回值都是promise
 */

import { message } from 'antd'
import ajax from './ajax'
import jsonp from 'jsonp'
import Category from '../pages/category/category'

const BASE = ''

// 请求登录接口
    // export const reqLogin = (username, password) => ajax('./login', {}) 
    // 加上{}后，要加上return 因为要返回一个对象，要有返回值
export const reqLogin = (username, password) => {return ajax('./login', {username, password}, 'POST')}

// 添加用户接口
export const reqAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST')

// 更新用户
export const reqUpdateUser = (user) => ajax(BASE + '/manage/user/update', user, 'POST')

// 添加或更新用户
export const reqAddOrUpdateUser = (user) => ajax(BASE+'/manage/user/'+(user._id?'update':'add'), user, 'POST')

// 删除用户
export const reqDeleteUser = (userId) => ajax(BASE+'/manage/user/delete', {userId}, 'POST')

// 获取所有用户列表
export const reqUserList = () => ajax(BASE + '/manage/user/list')

// 用户
//------------------------------------------------------------------------
// 天气


// 获取天气请求，不是ajax请求，是普通请求
export const reqWeather = () => {
    return new Promise((resolve, reject) => {
        // city=对应一个高德开发者对应的城市编码adcode,
        const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=1372b054b68415cbe1ae05a7bb23100d&city=510100&output=json`
        // 发送jsonp请求
        jsonp(url, {}, (err, data) => {
            console.log('jsonp()', err, data)
            // 如果成功了
            if(!err && data.status === '1'){
                const {weather, temperature} = data.lives[0]
                resolve({weather, temperature})
            } else{
                message.error('获取天气信息失败!')
            }
        })
    })
}
// reqWeather()

//------------------------------------------------------------------------
// 分类

// 获取一级/二级分类的列表
export const reqCategories = (parentId) => ajax(BASE + '/manage/category/list', {parentId})

// 添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', {categoryName, parentId}, 'POST')

// 更新分类
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax(BASE + '/manage/category/update', {categoryId, categoryName}, 'POST')

//根据分裂ID获取一个分类
export const reqCategory = (categoryId)=> ajax(BASE+'/manage/category/info', {categoryId})

//------------------------------------------------------------------------
// 商品

// 获取商品分页列表
export const reqProducts = (pageNum, pageSize)=> ajax(BASE+'/manage/product/list', {pageNum, pageSize})

// 搜索商品分页列表
export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax(BASE+'/manage/product/search', {
    pageNum, pageSize, [searchType]:searchName,
})

export const reqAddOrUpdateProduct = (product) => ajax(BASE+'/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')

// 对商品进行上架/下架操作
export const reqUpdateStatus = (productId, status)=> ajax(BASE+'/manage/product/updateStatus', {productId, status}, 'POST')

//------------------------------------------------------------------------
// 图片

export const reqDeleteImg = (name) => ajax(BASE+'/manage/img/delete',{name},'POST')

//------------------------------------------------------------------------
// 角色

// 获取角色列表
export const reqRoles = () => ajax(BASE + '/manage/role/list')

// 添加角色
export const reqAddRole = (roleName) => ajax(BASE+'/manage/role/add', {roleName}, 'POST')

// 更新角色
export const reqUpdateRole = (role) => ajax(BASE+'/manage/role/update', role, 'POST')

