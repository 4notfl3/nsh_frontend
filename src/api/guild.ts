/**
 * 帮会模块 —— API 请求
 *
 * 当前使用 Mock 数据，后端就绪后：
 *   1. 删除每个函数中的 mock fallback 逻辑
 *   2. 取消 get/post 调用上方的注释即可
 */
import { get, post } from './request'
import type { Guild } from '@/mock/guild'
import { getGuildList as mockList, getGuildById as mockDetail } from '@/mock/guild'

export type { Guild, Member, Honor, Recruitment, ContactInfo } from '@/mock/guild'

// ==================== 帮会列表 ====================
export async function fetchGuildList(page = 1, size = 20): Promise<{ list: Guild[]; total: number }> {
  // TODO: 后端就绪后替换为真实请求
  // return get<{ list: Guild[]; total: number }>('/guild/list', { params: { page, size } })

  // --- Mock 降级 ---
  return new Promise(resolve => {
    setTimeout(() => resolve(mockList(page, size)), 300)
  })
}

// ==================== 帮会详情 ====================
export async function fetchGuildDetail(id: number): Promise<Guild | null> {
  // TODO: 后端就绪后替换为真实请求
  // return get<Guild>(`/guild/${id}`)

  // --- Mock 降级 ---
  return new Promise(resolve => {
    setTimeout(() => resolve(mockDetail(id) ?? null), 300)
  })
}

// ==================== 大当家注册 ====================
export async function registerAsLeader(data: {
  guildName: string
  slogan: string
  description: string
  leaderName: string
  contactInfo: Record<string, string>
}): Promise<{ success: boolean; guildId?: number; message?: string }> {
  // TODO: 后端就绪后替换为真实请求
  // return post<{ success: boolean; guildId: number }>('/guild/register', { body: data })

  // --- Mock 降级 ---
  console.log('[Mock] 大当家注册请求:', data)
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ success: true, guildId: Date.now(), message: '注册成功！' })
    }, 600)
  })
}
