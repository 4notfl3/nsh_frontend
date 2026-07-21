<!--
  全局顶部导航栏
  主题：逆水寒攻略组
  导航项动态渲染，新增模块时自动出现
-->
<template>
  <header class="header">
    <div class="header-inner">
      <!-- Logo / 首页链接 -->
      <router-link to="/" class="logo" title="返回首页">
        <span class="logo-icon">⚔</span>
        <span class="logo-text">逆水寒攻略组</span>
      </router-link>

      <!-- 导航菜单：遍历路由配置 -->
      <nav class="nav">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          active-class="nav-link--active"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          {{ item.title }}
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { getNavItems } from '@/router'

const navItems = getNavItems()
</script>

<style scoped>
.header {
  position: sticky; top: 0; z-index: 100;
  background: var(--color-header-bg);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.header-inner {
  max-width: 1280px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 32px; height: 60px;
}
/* Logo */
.logo {
  display: flex; align-items: center; gap: 10px;
  color: var(--color-header-text);
  transition: opacity var(--transition-fast);
}
.logo:hover { opacity: 0.8; }
.logo-icon { font-size: 22px; }
.logo-text { font-size: 18px; font-weight: 700; letter-spacing: 0.5px; }

/* 导航链接 */
.nav { display: flex; gap: 4px; }
.nav-link {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 18px; border-radius: var(--radius-sm);
  color: rgba(255,255,255,0.6); font-size: 14px; font-weight: 500;
  transition: all var(--transition-fast);
}
.nav-link:hover { color: #fff; background: rgba(255,255,255,0.06); }
.nav-link--active { color: var(--color-accent-light); background: rgba(255,255,255,0.04); }
.nav-icon { font-size: 16px; }

@media (max-width: 640px) {
  .header-inner { padding: 0 16px; }
  .logo-text { font-size: 15px; }
  .nav-link { padding: 8px 10px; font-size: 13px; }
}
</style>
