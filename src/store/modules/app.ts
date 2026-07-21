/**
 * 全局应用状态
 * 管理：侧栏开关、加载状态、主题偏好等
 */
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  // --- 状态 ---
  const loading = ref(false)        // 全局加载态
  const sidebarOpen = ref(false)    // 侧栏（预留）

  // --- 操作 ---
  function setLoading(v: boolean) { loading.value = v }

  return { loading, sidebarOpen, setLoading }
})
