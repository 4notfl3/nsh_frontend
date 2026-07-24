<!--
  帮会详细介绍文字区（独立模块）
  展示：详细介绍文本 + 风格定位 + 帮会历史 + 创建时间
  沉浸式铺满整屏：标题固定 + 主体两栏 flex 均分剩余空间
-->
<template>
  <section class="intro-text-section">
    <div class="section-header">
      <h2 class="section-title">帮会介绍</h2>
      <div class="section-divider"></div>
    </div>

    <div class="intro-body">
      <!-- 左栏：详细介绍文字 -->
      <div class="intro-text-card card card-acrylic">
        <span class="quote-mark" aria-hidden="true">“</span>
        <div class="intro-text-scroll">
          <p class="intro-text">{{ guild.description }}</p>
        </div>
      </div>

      <!-- 右栏：三项信息，竖向均分高度 -->
      <div class="intro-meta-col">
        <div class="meta-card card card-acrylic">
          <span class="meta-label">风格定位</span>
          <span class="meta-value">{{ guild.style }}</span>
        </div>
        <div class="meta-card card card-acrylic">
          <span class="meta-label">帮会历史</span>
          <span class="meta-value">{{ guild.history }}</span>
        </div>
        <div class="meta-card card card-acrylic">
          <span class="meta-label">创建时间</span>
          <span class="meta-value">{{ guild.createdAt }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Guild } from '@/mock/guild'

defineProps<{ guild: Guild }>()
</script>

<style scoped>
/* 根容器：完全吃满父级（block-inner）给的高度与宽度 */
.intro-text-section {
  width: 100%;
  height: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* 标题区：固定高度，不参与拉伸 */
.section-header {
  flex-shrink: 0;
  text-align: center;
  margin-bottom: 24px;
}

.section-title {
  font-size: 26px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 12px;
  letter-spacing: 2px;
}

.section-divider {
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
  margin: 0 auto;
}

/* 主体区：占满标题以外的全部剩余空间，左右两栏 */
.intro-body {
  flex: 1;
  min-height: 0; /* 关键：允许 flex 子项内部再滚动而不撑破父级 */
  display: flex;
  gap: 24px;
}

/* ============================
   左栏：介绍文字
   ============================ */
.intro-text-card {
  flex: 1.4;
  min-width: 0;
  position: relative;
  padding: 36px 40px;
  display: flex;
  overflow: hidden;
}

.quote-mark {
  position: absolute;
  top: -10px;
  left: 20px;
  font-size: 120px;
  line-height: 1;
  font-family: Georgia, serif;
  color: var(--color-accent);
  opacity: 0.12;
  pointer-events: none;
  user-select: none;
}

/* 文字过长时仅在卡片内部滚动，不影响本屏以外的任何内容 */
.intro-text-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 8px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
}

.intro-text-scroll::-webkit-scrollbar {
  width: 4px;
}

.intro-text-scroll::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 4px;
}

.intro-text {
  position: relative;
  font-size: 16px;
  line-height: 2.1;
  color: var(--color-text);
  text-indent: 2em;
}

/* ============================
   右栏：三项信息，竖向均分整个高度
   ============================ */
.intro-meta-col {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.meta-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  padding: 24px 28px;
}

.meta-label {
  font-size: 13px;
  color: var(--color-accent-light);
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.meta-value {
  font-size: 17px;
  color: var(--color-text);
  line-height: 1.7;
}

/* ============================
   响应式：小屏两栏改上下堆叠
   ============================ */
@media (max-width: 900px) {
  .intro-body {
    flex-direction: column;
    overflow-y: auto; /* 移动端内容多时整块内部滚动 */
  }

  .intro-text-card {
    flex: none;
    padding: 28px 24px;
  }

  .intro-meta-col {
    flex: none;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .meta-card {
    flex: 1 1 calc(50% - 10px);
  }

  .quote-mark {
    font-size: 90px;
  }

  .section-title {
    font-size: 22px;
  }

  .intro-text-section {
    padding: 20px 16px;
  }
}

@media (max-width: 560px) {
  .meta-card {
    flex: 1 1 100%;
  }
}
</style>