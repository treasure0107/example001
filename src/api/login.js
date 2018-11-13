import request from '@/scripts/request'

export function login(userName, pwd) {
  return request({
    url: 'SysApi/Login',
    method: 'post',
    data: {
      userName,
      pwd
    }
  })
}

export function logout() {
  return request({
    url: 'SysApi/Logout',
    method: 'post'
  })
}
