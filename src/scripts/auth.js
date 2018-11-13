import { setStore, getStore, removeStore } from '@/scripts/store'

const TokenKey = 'Token'

export function getToken() {
  return getStore({
		name: TokenKey
	})
}

export function setToken(token) {
  return setStore({
		name: TokenKey,
		content: token,
		type: 'session'
	})
}

export function removeToken() {
  return removeStore({
		name: TokenKey
	})
}
