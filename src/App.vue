<!--
  App 根组件
  根据路由 meta.layout 自动切换布局：
    layout: 'blank' → 纯页面，无导航栏/页脚
    默认           → 暗色背景 + Header + 内容 + Footer
-->
<template>
  <!-- 默认布局 & 沉浸式布局：暗色背景轮播 -->
  <div v-if="showLayout || isImmersive" class="app-shell">
    <!-- 背景图片轮播：把图放进 public/img/，在下面 bgImages 数组里加路径即可 -->
    <div class="app-bg">
      <div
        v-for="(img, i) in bgImages"
        :key="img"
        class="bg-slide"
        :class="{ active: i === currentBg }"
        :style="{ backgroundImage: `url(${img})` }"
      ></div>
    </div>
    <div class="app-overlay"></div>
    <Header v-if="showLayout" />
    <main class="main-content" :class="{ 'main-content--full': isImmersive }">
      <router-view />
    </main>
    <Footer v-if="showLayout" />
  </div>

  <!-- 空白布局：仅渲染页面（登录页自带背景） -->
  <div v-else class="app-blank">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'

const route = useRoute()
const showLayout = computed(() => route.meta.layout !== 'blank' && route.meta.layout !== 'immersive')
const isImmersive = computed(() => route.meta.layout === 'immersive')

// 背景图片轮播：把图片放进 public/img/ 目录，比如 public/img/师姐1.jpg，
// 这里就写 '/img/师姐1.jpg'。想放几张放几张。
const bgImages = [
  '/img/师姐1.jpg',
  '/img/阿初1.jpg',
  '/img/侯爷.jpg',
  '/img/姬蜜儿.jpg',
  '/img/师姐2.jpg',
  '/img/师姐3.jpg',
  '/img/师兄1.jpg',
  '/img/月牙儿.jpg',
  '/img/花将离.jpg'
  // 继续往下加 '/img/xxx.jpg' ...
]

const currentBg = ref(0)
let bgTimer: ReturnType<typeof setInterval> | undefined

function startSlideshow() {
  if (bgImages.length <= 1) return
  bgTimer = setInterval(() => {
    currentBg.value = (currentBg.value + 1) % bgImages.length
  }, 6000) // 每张图停留6秒，配合CSS 3秒的淡入淡出过渡
}

onMounted(() => {
  startSlideshow()
})

onUnmounted(() => {
  clearInterval(bgTimer)
})
</script>

<style>
/* 暗色背景层 */
.app-shell {
  position: relative;
  min-height: 100vh;
}

.app-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
}

.bg-slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 3s ease; /* 慢速淡入淡出，改这个数值调切换速度 */
}

.bg-slide.active {
  opacity: 1;
}

.app-overlay {
  position: fixed;
  inset: 0;
  z-index: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.7) 100%);
  pointer-events: none;
}

.app-blank {
  min-height: 100vh;
}

/* 主内容区 */
.main-content {
  position: relative;
  z-index: 1;
  min-height: calc(100vh - 64px - 70px);
  padding-bottom: 40px;
}

/* 沉浸式布局：无 Header/Footer，撑满全屏 */
.main-content--full {
  min-height: 100vh;
  padding-bottom: 0;
}

/* 页面切换动画 */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>