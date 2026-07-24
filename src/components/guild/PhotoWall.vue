<!--
  照片墙组件（真实比例智能拼接版）
  读取每张图片真实宽高比 → 分行贪心分组 → 二分查找理想行高，
  使每行都精确撑满容器宽度，所有行总高度精确匹配容器高度（插空铺满，不留白不溢出）
-->
<template>
  <div ref="wallRef" class="photo-wall">
    <!-- 计算布局所需的图片尺寸时的占位 -->
    <div v-if="loadingLayout" class="wall-loading">
      <div class="loading-spinner"></div>
    </div>

    <div v-else class="masonry-rows">
      <div
        v-for="(row, rIdx) in layoutRows"
        :key="rIdx"
        class="masonry-row"
        :style="{ height: row.height + 'px' }"
      >
        <div
          v-for="item in row.items"
          :key="item.index"
          class="photo-item"
          :style="{ width: item.width + 'px', height: row.height + 'px' }"
          @click="openLightbox(item.index)"
        >
          <img :src="visiblePhotos[item.index]" :alt="`照片 ${item.index + 1}`" loading="lazy" />

          <div v-if="isLastItem(item.index) && hasMore" class="photo-overlay photo-overlay--more">
            <span class="more-count">+{{ photos.length - visiblePhotos.length + 1 }}</span>
            <span class="more-label">查看全部</span>
          </div>
          <div v-else class="photo-overlay">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 灯箱预览：始终基于完整 photos，可翻阅全部照片 -->
    <Teleport to="body">
      <transition name="lightbox">
        <div v-if="lightboxOpen" class="lightbox-overlay" @click="closeLightbox">
          <button class="lightbox-close" @click="closeLightbox" title="关闭">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <button
            v-if="photos.length > 1"
            class="lightbox-nav lightbox-prev"
            @click.stop="goTo(currentIndex - 1)"
            title="上一张"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15,18 9,12 15,6" />
            </svg>
          </button>

          <button
            v-if="photos.length > 1"
            class="lightbox-nav lightbox-next"
            @click.stop="goTo(currentIndex + 1)"
            title="下一张"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9,18 15,12 9,6" />
            </svg>
          </button>

          <img
            :src="photos[currentIndex]"
            :alt="`照片 ${currentIndex + 1}`"
            class="lightbox-img"
            @click.stop
          />

          <div class="lightbox-counter" v-if="photos.length > 1">
            {{ currentIndex + 1 }} / {{ photos.length }}
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

const props = withDefaults(defineProps<{ photos: string[]; maxVisible?: number; gap?: number }>(), {
  maxVisible: 12,
  gap: 8,
})

/* ============================
   1. 容器尺寸监听（决定拼接目标区域）
   ============================ */
const wallRef = ref<HTMLElement | null>(null)
const containerWidth = ref(0)
const containerHeight = ref(0)
let resizeObserver: ResizeObserver | null = null

function measureContainer() {
  if (!wallRef.value) return
  containerWidth.value = wallRef.value.clientWidth
  containerHeight.value = wallRef.value.clientHeight
}

onMounted(() => {
  measureContainer()
  resizeObserver = new ResizeObserver(() => measureContainer())
  if (wallRef.value) resizeObserver.observe(wallRef.value)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})

/* ============================
   2. 只取一屏能装下的照片数量，其余折叠进"查看全部"
   ============================ */
const visiblePhotos = computed(() => props.photos.slice(0, props.maxVisible))
const hasMore = computed(() => props.photos.length > props.maxVisible)

function isLastItem(idx: number) {
  return idx === visiblePhotos.value.length - 1
}

/* ============================
   3. 预加载图片，读取真实宽高比
   ============================ */
const ratios = ref<number[]>([])
const loadingLayout = ref(true)

async function loadRatios() {
  loadingLayout.value = true
  const list = visiblePhotos.value
  const results = await Promise.all(
    list.map(
      (url) =>
        new Promise<number>((resolve) => {
          const img = new Image()
          img.onload = () => {
            const r = img.naturalHeight > 0 ? img.naturalWidth / img.naturalHeight : 1
            resolve(r || 1)
          }
          img.onerror = () => resolve(1) // 加载失败按正方形兜底，不影响整体布局
          img.src = url
        })
    )
  )
  ratios.value = results
  loadingLayout.value = false
}

watch(() => visiblePhotos.value.join(','), loadRatios, { immediate: true })

/* ============================
   4. 核心算法：贪心分行 + 二分查找理想行高
   保证：每行精确撑满容器宽度；所有行总高度精确匹配容器高度
   ============================ */
interface RowItem { index: number; width: number }
interface Row { height: number; items: RowItem[] }

function finalizeRow(rowRatios: number[], startIdx: number, gap: number, width: number): Row {
  const gapsWidth = (rowRatios.length - 1) * gap
  const sumRatios = rowRatios.reduce((a, b) => a + b, 0)
  const rowHeight = Math.max(1, (width - gapsWidth) / sumRatios)
  const items = rowRatios.map((r, i) => ({ index: startIdx + i, width: r * rowHeight }))
  return { height: rowHeight, items }
}

function packAt(ideal: number, list: number[], gap: number, width: number) {
  const rows: Row[] = []
  let current: number[] = []
  let rowStart = 0

  list.forEach((ratio, i) => {
    const projected =
      current.reduce((s, r) => s + r * ideal, 0) + ratio * ideal + current.length * gap
    if (current.length > 0 && projected > width) {
      rows.push(finalizeRow(current, rowStart, gap, width))
      rowStart = i
      current = [ratio]
    } else {
      current.push(ratio)
    }
  })
  if (current.length) rows.push(finalizeRow(current, rowStart, gap, width))

  const totalHeight = rows.reduce((s, r) => s + r.height, 0) + (rows.length - 1) * gap
  return { rows, totalHeight }
}

const layoutRows = computed<Row[]>(() => {
  const list = ratios.value
  const width = containerWidth.value
  const height = containerHeight.value
  const gap = props.gap

  if (!list.length || width <= 0 || height <= 0) return []

  // 二分查找理想行高，使总高度尽可能贴近容器高度
  let lo = 20
  let hi = Math.max(height, 40)
  let best = packAt((lo + hi) / 2, list, gap, width)

  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2
    const result = packAt(mid, list, gap, width)
    if (Math.abs(result.totalHeight - height) < Math.abs(best.totalHeight - height)) {
      best = result
    }
    if (result.totalHeight > height) hi = mid
    else lo = mid
  }

  // 安全兜底：极端比例（如只有1张超窄长图）导致仍然偏高时，整体等比缩小，避免溢出
  if (best.totalHeight > height) {
    const scale = height / best.totalHeight
    best.rows.forEach((row) => {
      row.height *= scale
      row.items.forEach((it) => (it.width *= scale))
    })
  }

  return best.rows
})

/* ============================
   5. 灯箱
   ============================ */
const lightboxOpen = ref(false)
const currentIndex = ref(0)

function openLightbox(idx: number) {
  currentIndex.value = idx
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

function goTo(idx: number) {
  const len = props.photos.length
  currentIndex.value = ((idx % len) + len) % len
}

function onKeydown(e: KeyboardEvent) {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowLeft') goTo(currentIndex.value - 1)
  if (e.key === 'ArrowRight') goTo(currentIndex.value + 1)
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
.photo-wall {
  width: 100%;
  height: 100%;
  position: relative;
}

.wall-loading {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 28px;
  height: 28px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* 每行按算法结果精确撑满宽度；若安全兜底缩小了，居中显示 */
.masonry-rows {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: v-bind('props.gap + "px"');
}

.masonry-row {
  display: flex;
  justify-content: center;
  gap: v-bind('props.gap + "px"');
  width: 100%;
}

.photo-item {
  position: relative;
  flex-shrink: 0;
  border-radius: var(--radius-sm);
  overflow: hidden;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.03);
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 理论上尺寸已按真实比例算好，cover 仅用于兜底像素误差 */
  display: block;
  transition: transform var(--transition-smooth);
}

.photo-item:hover img {
  transform: scale(1.05);
}

.photo-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity var(--transition-fast);
  color: #fff;
}

.photo-item:hover .photo-overlay {
  opacity: 1;
}

.photo-overlay--more {
  opacity: 1;
  background: rgba(0, 0, 0, 0.55);
  flex-direction: column;
  gap: 4px;
}

.more-count {
  font-size: 22px;
  font-weight: 700;
}

.more-label {
  font-size: 12px;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.8);
}

/* 灯箱 */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.92);
  backdrop-filter: blur(12px);
}

.lightbox-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  color: #fff;
  cursor: pointer;
  transition: background var(--transition-fast);
  z-index: 1;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.15);
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  color: #fff;
  cursor: pointer;
  transition: all var(--transition-fast);
  z-index: 1;
}

.lightbox-nav:hover {
  background: rgba(255, 255, 255, 0.18);
}

.lightbox-prev { left: 20px; }
.lightbox-next { right: 20px; }

.lightbox-img {
  max-width: 85vw;
  max-height: 85vh;
  object-fit: contain;
  border-radius: var(--radius-sm);
}

.lightbox-counter {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 18px;
  border-radius: 100px;
  background: rgba(0, 0, 0, 0.5);
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  backdrop-filter: blur(4px);
}

.lightbox-enter-active { transition: opacity 0.3s ease; }
.lightbox-leave-active { transition: opacity 0.2s ease; }
.lightbox-enter-from,
.lightbox-leave-to { opacity: 0; }

@media (max-width: 640px) {
  .lightbox-nav { display: none; }
}
</style>