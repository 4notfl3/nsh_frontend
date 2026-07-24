<!--
  集体合照模块（独立轮播）
  展示帮会全体成员合照：左右箭头切换 + 触摸滑动 + 底部圆点指示
  沉浸式铺满整屏：标题固定 + 图片区占满剩余全部空间
-->
<template>
  <section class="group-photo-section">
    <div class="section-header">
      <h2 class="section-title">集体合照</h2>
      <div class="section-divider"></div>
    </div>

    <div class="photo-viewport" @touchstart="onTouchStart" @touchend="onTouchEnd">
      <div class="photo-track" :style="trackStyle">
        <div v-for="(photo, idx) in photos" :key="idx" class="photo-slide">
          <img :src="photo" :alt="`合照 ${idx + 1}`" class="group-photo-img" loading="lazy" />
        </div>
      </div>

      <button v-if="photos.length > 1" class="photo-nav photo-nav--prev" @click="goTo(current - 1)">◀</button>
      <button v-if="photos.length > 1" class="photo-nav photo-nav--next" @click="goTo(current + 1)">▶</button>

      <div v-if="photos.length > 1" class="photo-counter">{{ current + 1 }} / {{ photos.length }}</div>

      <div v-if="photos.length > 1" class="photo-dots">
        <button v-for="(_, idx) in photos" :key="idx" class="photo-dot"
          :class="{ 'is-active': idx === current }" @click="goTo(idx)" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Guild } from '@/mock/guild'

const props = defineProps<{ guild: Guild }>()

const photos = computed<string[]>(() => {
  if (props.guild.groupPhotos?.length) return props.guild.groupPhotos
  if ((props.guild as any).groupPhoto) return [(props.guild as any).groupPhoto]
  return []
})

const current = ref(0)

function goTo(idx: number) {
  const len = photos.value.length
  if (len === 0) return
  current.value = ((idx % len) + len) % len
}

const trackStyle = computed(() => ({ transform: `translateX(-${current.value * 100}%)` }))

let touchStartX = 0
function onTouchStart(e: TouchEvent) { touchStartX = e.changedTouches[0].clientX }
function onTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0].clientX - touchStartX
  if (Math.abs(dx) < 40) return
  goTo(current.value + (dx < 0 ? 1 : -1))
}
</script>

<style scoped>
.group-photo-section { width: 100%; height: 100%; max-width: 1100px; margin: 0 auto; padding: 32px 24px; display: flex; flex-direction: column; box-sizing: border-box; }
.section-header { flex-shrink: 0; text-align: center; margin-bottom: 24px; }
.section-title { font-size: 26px; font-weight: 700; letter-spacing: 2px; margin-bottom: 12px; }
.section-divider { width: 60px; height: 2px; margin: 0 auto; background: linear-gradient(90deg, transparent, var(--color-accent), transparent); }

.photo-viewport { flex: 1; min-height: 0; position: relative; overflow: hidden; border-radius: var(--radius-md); }
.photo-track { width: 100%; height: 100%; display: flex; transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1); }
.photo-slide { flex: 0 0 100%; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
.group-photo-img { max-width: 100%; max-height: 100%; object-fit: contain; border-radius: var(--radius-sm); }

.photo-nav { position: absolute; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; border-radius: 50%; background: rgba(0,0,0,0.35); border: none; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background var(--transition-fast); z-index: 2; font-size: 16px; }
.photo-nav:hover { background: rgba(0,0,0,0.55); }
.photo-nav--prev { left: 20px; }
.photo-nav--next { right: 20px; }

.photo-counter { position: absolute; top: 20px; right: 20px; padding: 4px 14px; border-radius: 100px; background: rgba(0,0,0,0.4); color: rgba(255,255,255,0.8); font-size: 12px; backdrop-filter: blur(4px); z-index: 2; }
.photo-dots { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; z-index: 2; }
.photo-dot { width: 8px; height: 8px; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.4); background: rgba(255,255,255,0.15); cursor: pointer; padding: 0; transition: all 0.3s ease; }
.photo-dot.is-active { background: var(--color-accent); border-color: var(--color-accent); transform: scale(1.3); }

@media (max-width: 768px) {
  .group-photo-section { padding: 20px 16px; }
  .section-title { font-size: 22px; }
  .photo-nav { width: 36px; height: 36px; }
  .photo-nav--prev { left: 10px; }
  .photo-nav--next { right: 10px; }
}
</style>
