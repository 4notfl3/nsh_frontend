/**
 * HTTP 请求封装
 *
 * 使用 fetch 为基础，轻量封装。
 * 后续如需更复杂的拦截器/超时/重试，可替换为 axios。
 *
 * 对接后端时修改 BASE_URL 即可切换环境。
 */

// ==================== 配置（根据环境自动切换） ====================
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// ==================== 通用请求方法 ====================
interface RequestOptions {
  /** 查询参数 */
  params?: Record<string, string | number>
  /** 请求体（自动 JSON 序列化） */
  body?: unknown
  /** 自定义请求头 */
  headers?: Record<string, string>
}

/** 发起 GET 请求 */
export async function get<T = unknown>(url: string, options?: RequestOptions): Promise<T> {
  return request<T>('GET', url, options)
}

/** 发起 POST 请求 */
export async function post<T = unknown>(url: string, options?: RequestOptions): Promise<T> {
  return request<T>('POST', url, options)
}

// ==================== 核心请求函数 ====================
async function request<T = unknown>(
  method: string,
  url: string,
  options?: RequestOptions,
): Promise<T> {
  // 拼接查询参数
  let fullUrl = `${BASE_URL}${url}`
  if (options?.params) {
    const qs = new URLSearchParams(
      Object.entries(options.params).map(([k, v]) => [k, String(v)])
    ).toString()
    fullUrl += `?${qs}`
  }

  // 构建请求配置
  const init: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  }

  // 有 body 时序列化为 JSON
  if (options?.body) {
    init.body = JSON.stringify(options.body)
  }

  // 发起请求
  const response = await fetch(fullUrl, init)

  // 非 2xx 视为错误
  if (!response.ok) {
    const errorBody = await response.text().catch(() => '')
    throw new Error(`[${response.status}] ${errorBody || response.statusText}`)
  }

  // 解析 JSON 响应
  return response.json() as Promise<T>
}
