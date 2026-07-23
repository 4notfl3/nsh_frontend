# 逆水寒攻略组 · 前端项目

基于 **Vue 3 + TypeScript + Vite + Pinia** 构建的逆水寒帮战数据可视化工具。

## 项目结构

```
nsh_think/
├── public/
│   ├── favicon.ico
│   └── data/                  # 示例数据文件
├── src/
│   ├── assets/styles/         # 全局样式（CSS 变量、重置、工具类）
│   ├── components/
│   │   ├── common/            # 可复用小组件（预留）
│   │   └── layout/            # 全局布局组件
│   │       ├── Header.vue     # 顶部导航栏
│   │       └── Footer.vue     # 底部信息栏
│   ├── views/                 # 页面组件
│   │   ├── Home.vue           # 首页
│   │   ├── Guild.vue          # 帮会（预留）
│   │   ├── Tools.vue          # 工具入口
│   │   └── DataViz.vue        # 数据可视化（核心功能）
│   ├── router/index.ts        # 路由配置（导航栏自动同步）
│   ├── store/modules/         # Pinia 状态管理
│   │   ├── app.ts             # 全局应用状态
│   │   └── user.ts            # 用户状态（预留）
│   ├── api/                   # 接口封装
│   │   ├── request.ts         # HTTP 请求基础封装
│   │   └── user.ts            # 用户相关 API（示例）
│   ├── utils/                 # 工具函数
│   │   ├── format.ts          # 数字/文本格式化
│   │   ├── csv.ts             # CSV 解析（逆水寒约战格式）
│   │   └── validate.ts        # 通用校验
│   ├── composables/           # 组合式函数
│   │   └── useAuth.ts         # 鉴权逻辑（预留）
│   ├── App.vue
│   └── main.ts
├── .env                       # 开发环境变量
├── .env.production            # 生产环境变量
├── vite.config.ts
├── package.json
└── index.html
```

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 核心功能

### 📊 数据可视化（`/tools/viz`）
- 上传逆水寒约战 CSV 数据文件（支持拖拽）
- 按对局、职业、指标三维筛选
- 雷达图：同职业多玩家数据对比（支持多选）
- 柱状图：全阵营按指标排名
- 概览统计卡片

### 🧭 导航模块
当前包含 **帮会** 和 **工具** 两个模块，添加新模块只需在 `src/router/index.ts` 中追加路由：

```ts
{ path: '/strategy', name: 'Strategy', component: ...,
  meta: { title: '攻略', icon: '📖', showInNav: true } }
```

导航栏会自动读取并渲染。

## 技术栈

| 技术 | 用途 |
|------|------|
| Vue 3 (Composition API) | 前端框架 |
| TypeScript | 类型安全 |
| Vite | 构建工具 |
| Pinia | 状态管理 |
| Vue Router 4 | 路由管理 |
| ECharts 5 | 数据可视化图表 |
| Fetch API | HTTP 请求 |

## 设计理念

- **简洁优先**：CSS 变量统一主题，工具类复用样式
- **柔滑动效**：页面切换动画、hover 微交互、平滑过渡
- **模块解耦**：视图 / 状态 / API 分层清晰，便于后期对接后端
- **易于扩展**：导航栏由路由配置驱动，新增页面零配置

## 后端仓库

[nsh_backend](https://github.com/4notfl3/nsh_Backend)
 