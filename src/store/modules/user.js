import { login, logout } from '@/api/login'
import { getToken, setToken, removeToken } from '@/scripts/auth'
import { setStore, getStore, removeStore } from '@/scripts/store'
const user = {
  state: {
    token: getToken()
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const userName = userInfo.userName.trim()
      return new Promise((resolve, reject) => {
        login(userName, userInfo.pwd).then(response => {
          const data = response;
          setToken('bearer ' + data.Data.Token)
          commit('SET_TOKEN','bearer ' + data.Data.Token)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        logout().then(response => {
					const data = response;
					setToken('')
          commit('SET_TOKEN', '')
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user
