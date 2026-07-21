/**
 * 用户状态
 * 预留：登录态、角色信息、偏好设置
 * 后续对接后端时在此扩展
 */
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  // --- 状态 ---
  const token = ref('')
  const nickname = ref('')
  const role = ref('')  // 游戏角色名

  // --- 计算 ---
  const isLoggedIn = computed(() => !!token.value)

  // --- 操作 ---
  function login(t: string, name: string) {
    token.value = t
    nickname.value = name
  }
  function logout() {
    token.value = ''
    nickname.value = ''
    role.value = ''
  }

  return { token, nickname, role, isLoggedIn, login, logout }
})
