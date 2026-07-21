/**
 * 路由配置
 *
 * 新增导航模块只需在 navItems 数组中追加一项即可，
 * 导航栏和路由注册都会自动同步。
 */
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// ==================== 路由定义 ====================
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '主页', icon: '⚔', showInNav: true },
  },
  {
    path: '/guild',
    name: 'Guild',
    component: () => import('@/views/Guild.vue'),
    meta: { title: '帮会', icon: '🏠', showInNav: true },
  },
  {
    path: '/tools',
    name: 'Tools',
    component: () => import('@/views/Tools.vue'),
    meta: { title: '工具', icon: '🔧', showInNav: true },
  },
  {
    path: '/tools/viz',
    name: 'DataViz',
    component: () => import('@/views/DataViz.vue'),
    meta: { title: '数据可视化', showInNav: false },
  },
  // 后续添加模块示例：
  // { path: '/strategy', name: 'Strategy', component: ..., meta: { title: '攻略', icon: '📖', showInNav: true } },
]

// ==================== 路由实例 ====================
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' } // 页面切换平滑滚动到顶部
  },
})

export default router

// ==================== 导出给导航栏使用的配置 ====================
/** 从路由表中提取需要在导航栏显示的项目 */
export function getNavItems(): { path: string; title: string; icon: string }[] {
  return routes
    .filter(r => r.meta?.showInNav === true)
    .map(r => ({
      path: r.path,
      title: (r.meta?.title as string) || r.path,
      icon: (r.meta?.icon as string) || '',
    }))
}
