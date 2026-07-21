/**
 * 用户相关 API
 *
 * 示例接口结构，对接后端时填入真实地址。
 */

import { get, post } from './request'

// --- 类型 ---
export interface UserInfo {
  id: number
  nickname: string
  avatar: string
  role: string  // 游戏角色
}

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  token: string
  user: UserInfo
}

// --- 接口 ---

/** 获取当前用户信息 */
export function fetchUserInfo(): Promise<UserInfo> {
  return get<UserInfo>('/user/info')
}

/** 登录 */
export function loginApi(params: LoginParams): Promise<LoginResult> {
  return post<LoginResult>('/user/login', { body: params })
}

/** 获取用户列表（示例） */
export function fetchUserList(page = 1, size = 20): Promise<{ list: UserInfo[]; total: number }> {
  return get('/user/list', { params: { page, size } })
}
