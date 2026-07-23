<!--
  全局顶部导航栏
  左侧主题图 + 中间导航 + 右侧用户信息
  半透明毛玻璃效果
-->
<template>
  <header class="header">
    <div class="header-inner">
      <!-- Logo 图片 -->
      <router-link to="/home" class="logo">
        <img src="/img/主题.webp" alt="逆水寒攻略组" class="logo-img">
      </router-link>

      <!-- 导航菜单 -->
      <nav class="nav">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          active-class="nav-link--active"
        >
          {{ item.title }}
        </router-link>
      </nav>

      <!-- 用户信息 -->
      <div class="user-area">
        <span class="user-name">{{ displayName }}</span>
        <span v-if="role && !isGuest" class="user-role">{{ roleText }}</span>
        <span v-if="isGuest" class="user-role guest-tag">游客</span>
        <button class="logout-btn" @click="handleLogout" title="退出登录">退出</button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { getNavItems } from '@/router'
import { useUserStore } from '@/store/modules/user'

const navItems = getNavItems()
const userStore = useUserStore()
const router = useRouter()

const isGuest = computed(() => userStore.isGuest)
const role = computed(() => userStore.role)

const displayName = computed(() => userStore.nickname || '未登录')

const roleText = computed(() => {
  const map: Record<string, string> = { admin: '管理员', user: '用户', guest: '游客' }
  return map[userStore.role] || userStore.role
})

function handleLogout() {
  userStore.logout()
  router.replace('/')
}
</script>

<style scoped>
.header {
  position: sticky; top: 0; z-index: 100;
  opacity: 0.9;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.header-inner {
  max-width: 1280px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 32px; height: 64px;
}

/* Logo 图片 */
.logo {
  display: flex; align-items: center;
  transition: opacity var(--transition-fast);
  text-decoration: none;
}
.logo:hover { opacity: 0.8; }
.logo-img {
  height: 36px;
  width: auto;
}

/* 导航 */
.nav { display: flex; gap: 4px; }
.nav-link {
  display: inline-flex; align-items: center;
  padding: 8px 20px; border-radius: var(--radius-sm);
  color: rgba(255,255,255,0.55); font-size: 15px; font-weight: 500;
  transition: all var(--transition-fast);
  text-decoration: none;
}
.nav-link:hover { color: #fff; background: rgba(255,255,255,0.08); }
.nav-link--active { color: var(--color-accent-light); background: rgba(255,255,255,0.06); }

/* 用户区域 */
.user-area {
  display: flex; align-items: center; gap: 8px;
  margin-left: auto; padding-left: 24px;
}
.user-name {
  color: rgba(255,255,255,0.8);
  font-size: 14px; font-weight: 500;
}
.user-role {
  padding: 2px 8px; border-radius: 100px;
  background: rgba(201,168,124,0.15);
  color: var(--color-accent-light);
  font-size: 12px; font-weight: 500;
}
.guest-tag {
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.4);
}
.logout-btn {
  padding: 4px 12px; border: 1px solid rgba(255,255,255,0.12);
  border-radius: var(--radius-sm);
  background: transparent;
  color: rgba(255,255,255,0.45);
  font-size: 13px; cursor: pointer;
  transition: all var(--transition-fast);
}
.logout-btn:hover {
  border-color: rgba(255,100,100,0.35);
  color: #f56c6c;
}

@media (max-width: 640px) {
  .header-inner { padding: 0 16px; }
  .logo-img { height: 28px; }
  .nav-link { padding: 8px 10px; font-size: 13px; }
  .user-name { display: none; }
}
</style>
