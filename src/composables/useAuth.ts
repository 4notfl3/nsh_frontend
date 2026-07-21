/**
 * 鉴权逻辑组合式函数
 *
 * 封装登录/登出/Token 管理。
 * 后续对接后端时在此补全鉴权流程。
 */
import { ref } from 'vue'
import { useUserStore } from '@/store/modules/user'

export function useAuth() {
  const userStore = useUserStore()
  const error = ref('')

  /** 模拟登录 —— 对接后端时替换为 API 调用 */
  async function login(username: string, password: string) {
    error.value = ''
    try {
      // TODO: 调用 loginApi({ username, password })
      // const result = await loginApi({ username, password })
      // userStore.login(result.token, result.user.nickname)
      userStore.login('mock-token', username)
      return true
    } catch (e) {
      error.value = (e as Error).message
      return false
    }
  }

  /** 退出登录 */
  function logout() {
    userStore.logout()
  }

  return { error, login, logout, isLoggedIn: userStore.isLoggedIn }
}
