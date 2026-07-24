<!-- 集体合照模块（独立轮播）：标题 + 左右按钮在外侧 + 底部圆点 -->
<template>
  <section class="group-photo-section">
    <div class="section-header">
      <h2 class="section-title">集体合照</h2>
      <div class="section-divider"></div>
    </div>

    <div class="photo-stage">
      <button v-if="photos.length > 1" class="photo-nav photo-nav--prev" @click="goTo(current - 1)">◀</button>

      <div class="photo-viewport" @touchstart="onTouchStart" @touchend="onTouchEnd">
        <div class="photo-track" :style="trackStyle">
          <div v-for="(photo, idx) in photos" :key="idx" class="photo-slide">
            <img :src="photo" :alt="`合照 ${idx + 1}`" class="group-photo-img" loading="lazy" />
          </div>
        </div>

        <div v-if="photos.length > 1" class="photo-dots">
          <button v-for="(_, idx) in photos" :key="idx" class="photo-dot"
            :class="{ 'is-active': idx === current }" @click="goTo(idx)" />
        </div>
      </div>

      <button v-if="photos.length > 1" class="photo-nav photo-nav--next" @click="goTo(current + 1)">▶</button>
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

.photo-stage { flex: 1; min-height: 0; display: flex; align-items: center; gap: 12px; }
.photo-nav {
  width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.6); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s; font-size: 16px;
}
.photo-nav:hover { background: rgba(255,255,255,0.12); color: #fff; }

.photo-viewport { flex: 1; min-height: 0; position: relative; overflow: hidden; border-radius: var(--radius-md); height: 100%; }
.photo-track { width: 100%; height: 100%; display: flex; transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1); }
.photo-slide { flex: 0 0 100%; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
.group-photo-img { max-width: 100%; max-height: 100%; object-fit: contain; border-radius: var(--radius-sm); }

.photo-dots { position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; z-index: 2; }
.photo-dot { width: 8px; height: 8px; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.4); background: rgba(255,255,255,0.15); cursor: pointer; padding: 0; transition: all 0.3s ease; }
.photo-dot.is-active { background: var(--color-accent); border-color: var(--color-accent); transform: scale(1.3); }

@media (max-width: 768px) {
  .group-photo-section { padding: 20px 16px; }
  .section-title { font-size: 22px; }
  .photo-nav { width: 36px; height: 36px; }
}
</style>
