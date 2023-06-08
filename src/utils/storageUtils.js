/* */
import store from 'store'       // 支持跨浏览器的数据存储
const USER_KEY = 'user_key'
export default {
    // 保存user
    saveUser(user){
        // localStorage.setItem(USER_KEY, JSON.stringify(user))    原生的数据存储
        store.set(USER_KEY, user)
    },

    // 读取user
    getUser(){
        // return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
        return store.get(USER_KEY || {})
    },

    // 删除user
    removeUser(){
        // localStorage.removeItem(USER_KEY)
        store.remove(USER_KEY)
    }
}