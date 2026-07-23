/**
 * 用户状态
 * 管理登录态、用户信息，与 localStorage 双向同步
 */
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  // --- 初始化：从 localStorage 恢复登录态 ---
  const savedToken = localStorage.getItem('token') || ''
  const savedUser = (() => {
    try {
      const raw = localStorage.getItem('user')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })()

  // --- 状态 ---
  const token = ref(savedToken)
  const nickname = ref(savedUser?.username || '')
  const role = ref(savedUser?.role || '')
  const userId = ref(savedUser?.id ?? null)

  // --- 计算 ---
  const isLoggedIn = computed(() => !!token.value)
  const isGuest = computed(() => role.value === 'guest')

  // --- 操作 ---
  function login(t: string, userInfo: { id: number; username: string; role: string }) {
    token.value = t
    nickname.value = userInfo.username
    role.value = userInfo.role
    userId.value = userInfo.id

    localStorage.setItem('token', t)
    localStorage.setItem('user', JSON.stringify(userInfo))
  }

  function logout() {
    token.value = ''
    nickname.value = ''
    role.value = ''
    userId.value = null

    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return { token, nickname, role, userId, isLoggedIn, isGuest, login, logout }
})
