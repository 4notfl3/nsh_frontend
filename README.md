# 逆水寒攻略组 · 前端项目

基于 **Vue 3 + TypeScript + Vite + Pinia** 构建的逆水寒帮会展示与数据可视化工具。

## 项目结构

```
nsh_think/
├── public/
│   ├── img/                    # 背景图、主题素材
│   ├── png/                    # 角色立绘
│   ├── guild/                  # 帮会合照
│   ├── banghui/                # 帮会卡片背景
│   └── data/                   # 示例 CSV 数据
├── src/
│   ├── assets/styles/main.css  # 全局样式（CSS 变量、暗色主题）
│   ├── components/
│   │   ├── guild/              # 帮会模块组件
│   │   │   ├── GuildHero.vue         # 人物主视觉（成员面板 + 背景轮播 + 语录）
│   │   │   ├── GuildGroupPhoto.vue   # 集体合照轮播
│   │   │   ├── GuildCard.vue         # 帮会列表小卡片
│   │   │   ├── GuildIntroText.vue    # 帮会详细介绍
│   │   │   ├── GuildHonors.vue       # 帮会荣誉
│   │   │   ├── GuildRecruitment.vue  # 招募 & 联系
│   │   │   ├── PhotoWall.vue         # 照片墙
│   │   │   └── MemberPopup.vue       # 成员详情弹窗
│   │   └── layout/            # 全局布局组件
│   │       ├── Header.vue     # 顶部导航栏（半透明毛玻璃 + 主题图）
│   │       └── Footer.vue     # 底部信息栏
│   ├── views/                 # 页面组件
│   │   ├── Login.vue          # 登录 / 注册 / 游客登录
│   │   ├── Home.vue           # 首页
│   │   ├── Guild.vue          # 帮会列表
│   │   ├── GuildDetail.vue    # 帮会详情（全屏沉浸式逐页浏览）
│   │   ├── Tools.vue          # 工具入口
│   │   └── DataViz.vue        # 数据可视化
│   ├── router/index.ts        # 路由配置（meta.layout 控制布局切换）
│   ├── store/modules/         # Pinia 状态管理
│   │   ├── app.ts             # 全局应用状态
│   │   └── user.ts            # 用户登录态（localStorage 同步）
│   ├── api/                   # 接口封装
│   │   ├── request.ts         # HTTP 请求基础封装（fetch）
│   │   ├── user.ts            # 用户相关 API
│   │   └── guild.ts           # 帮会相关 API（当前 Mock）
│   ├── mock/
│   │   └── guild.ts           # 帮会类型定义 + Mock 数据
│   ├── utils/                 # 工具函数
│   │   ├── format.ts          # 数字/文本格式化
│   │   ├── csv.ts             # CSV 解析（逆水寒约战格式）
│   │   └── validate.ts        # 通用校验
│   ├── composables/
│   │   └── useAuth.ts         # 鉴权封装（登录/登出/Token）
│   ├── App.vue
│   └── main.ts
├── .env                       # 开发环境变量
├── .env.production            # 生产环境变量
├── vite.config.ts
├── package.json
└── index.html
```


## 关于图片

这里不做图片的开源，具体要切换图片自行去添加

```
nsh_think/
├── public/
│   ├── img/                    # 背景图、主题素材
│   ├── png/                    # 角色立绘
│   ├── guild/                  # 帮会合照
│   ├── banghui/                # 帮会卡片背景  
|   └── to/                     # 角色头像
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

## 路由 & 布局

路由通过 `meta.layout` 切换布局（`src/router/index.ts`）：

| layout | 效果 | 适用页面 |
|---|---|---|
| `blank` | 纯页面，无 Header/Footer | 登录页 |
| `immersive` | 全屏沉浸，无导航栏 | 帮会详情 |
| 默认 | Header + 内容 + Footer | 首页、帮会列表、工具 |

`App.vue` 根据 `route.meta.layout` 自动渲染对应布局，添加新模块只需在路由表中追加一项。

## 核心功能

### 🏠 帮会模块

**帮会列表** — 居中网格排列，3 列自适应，卡片展示 logo / 名称 / 标语 / 人数 / 大当家。

**帮会详情** — 全屏逐页沉浸式浏览，侧边圆点导航：

| 区块 | 组件 | 功能 |
|---|---|---|
| 人物主视觉 | `GuildHero` | 左侧隐藏成员面板（鼠标靠左滑出）→ 点击切换背景轮播 + 竖排语录 + 职位 + 简介 |
| 帮会介绍 | `GuildIntroText` | 风格/历史/详细介绍 |
| 集体合照 | `GuildGroupPhoto` | 左右按钮在外侧的轮播 + 底部圆点 |
| 照片墙 | `PhotoWall` | 帮会风采网格展示 |
| 荣誉 | `GuildHonors` | 荣誉列表 |
| 招募 | `GuildRecruitment` | 招募信息 + 联系方式 |

全局背景图跟随角色选择切换，滚动不消失。

### 👤 登录模块

- 图片轮播背景 + 登录 / 注册 / 游客登录
- JWT 认证，localStorage + Pinia 双同步
- 游客登录走 `/api/guest-login`，返回临时凭证

### 📊 数据可视化（`/tools/viz`）

- 上传逆水寒约战 CSV 数据文件（支持拖拽）
- 按对局、职业、指标三维筛选
- 雷达图：同职业多玩家数据对比（支持多选）
- 柱状图：全阵营按指标排名，x 轴标签斜排
- 概览统计卡片 + 职业分布弹窗

## 技术栈

| 技术 | 用途 |
|------|------|
| Vue 3 (Composition API) | 前端框架 |
| TypeScript | 类型安全 |
| Vite | 构建工具 |
| Pinia | 状态管理 |
| Vue Router 4 | 路由管理 |
| ECharts 5 | 数据可视化图表 |
| axios | HTTP 请求 |

## 设计理念

- **暗色主题**：全局 CSS 变量统一暗色风格，毛玻璃质感
- **柔滑动效**：页面切换动画、hover 微交互、平滑过渡
- **模块解耦**：视图 / 状态 / API 分层清晰，便于对接后端
- **易于扩展**：导航栏由路由配置驱动，新增页面零配置

## 后端仓库

[nsh_backend](https://github.com/4notfl3/nsh_Backend)
