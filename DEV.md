# 开发文档 · 后端对接指南

本文档供前端打包后与后端对接使用，包含接口规范、环境配置、数据流说明。

## 一、环境配置

### 前端环境变量

| 变量 | 开发 (.env) | 生产 (.env.production) | 说明 |
|------|------------|----------------------|------|
| `VITE_API_BASE_URL` | `/api` | `https://api.example.com` | API 基础地址 |
| `VITE_APP_TITLE` | `逆水寒攻略组` | `逆水寒攻略组` | 应用标题 |

- 开发时通过 Vite proxy 代理 `/api` 到后端服务
- 生产构建时直接请求完整 URL

### Vite 代理配置

如需在开发环境代理后端请求，在 `vite.config.ts` 中添加：

```ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',  // 后端地址
        changeOrigin: true,
      },
    },
  },
})
```

## 二、API 接口规范

> 以下为前端预留的接口结构，后端可参照实现。

### 基础约定

- **请求格式**：`Content-Type: application/json`
- **响应格式**：JSON，统一结构建议：
  ```json
  {
    "code": 0,        // 0 = 成功，非 0 = 错误码
    "message": "ok",
    "data": { ... }   // 实际数据
  }
  ```
- **鉴权方式**：Bearer Token（Header: `Authorization: Bearer <token>`）

### 接口列表

#### 1. 用户登录

```
POST /api/user/login
Content-Type: application/json

请求体：
{
  "username": "string",
  "password": "string"
}

响应：
{
  "code": 0,
  "data": {
    "token": "eyJhbG...",
    "user": {
      "id": 1,
      "nickname": "玩家名",
      "avatar": "/avatars/1.png",
      "role": "游戏角色名"
    }
  }
}
```

#### 2. 获取用户信息

```
GET /api/user/info
Authorization: Bearer <token>

响应：
{
  "code": 0,
  "data": {
    "id": 1,
    "nickname": "玩家名",
    "avatar": "/avatars/1.png",
    "role": "游戏角色名"
  }
}
```

#### 3. 用户列表（分页）

```
GET /api/user/list?page=1&size=20

响应：
{
  "code": 0,
  "data": {
    "list": [ ... ],
    "total": 100
  }
}
```

## 三、CSV 数据格式

前端数据可视化模块解析的 CSV 格式：

```csv
"对局名称","60"
"玩家名字","职业","击败/清泉","助攻","资源","对玩家伤害","人伤卸甲","对建筑伤害","破塔卸甲","治疗值","承受伤害","重伤","复活/清泉","焚骨"
"玩家A","铁衣"," 5/1","69","0","4032664","0","6449652","0","0","11910609","9","0","0"
...（60行玩家数据）
```

- 多场对局按以上格式依次拼接
- 字段名固定不变（逆水寒约战导出标准格式）

## 四、项目构建命令

```bash
# 类型检查
npm run type-check

# 生产构建（输出到 dist/）
npm run build

# 本地预览构建产物
npm run preview
```

构建产物在 `dist/` 目录，可直接部署到 Nginx/CDN 等静态服务器。

## 五、状态管理说明

| Store | 文件 | 用途 |
|-------|------|------|
| `useAppStore` | `store/modules/app.ts` | 全局 loading、侧栏开关 |
| `useUserStore` | `store/modules/user.ts` | token、用户昵称、登录态 |

## 六、路由表

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | Home.vue | 首页 |
| `/guild` | Guild.vue | 帮会（预留） |
| `/tools` | Tools.vue | 工具入口 |
| `/tools/viz` | DataViz.vue | 数据可视化 |
