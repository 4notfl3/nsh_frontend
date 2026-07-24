<!--
  区块 C：帮会荣誉区（可选模块）
  需求文档 3.2 区块C：荣誉为空时整个区块隐藏，不显示"暂无荣誉"占位
-->
<template>
  <section v-if="honors.length > 0" class="honors-section">
    <div class="section-header">
      <h2 class="section-title">帮会荣誉</h2>
      <div class="section-divider"></div>
    </div>

    <!-- 荣誉时间线 -->
    <div class="honors-timeline">
      <div
        v-for="(honor, idx) in honors"
        :key="honor.id"
        class="honor-item"
        :style="{ animationDelay: idx * 0.1 + 's' }"
      >
        <!-- 时间线节点 -->
        <div class="timeline-node">
          <div class="node-dot"></div>
          <div v-if="idx < honors.length - 1" class="node-line"></div>
        </div>

        <!-- 荣誉卡片 -->
        <div class="honor-card card card-acrylic">
          <div class="honor-badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <div class="honor-content">
            <h4 class="honor-title">{{ honor.title }}</h4>
            <p class="honor-desc">{{ honor.description }}</p>
            <span class="honor-date">{{ honor.date }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Honor } from '@/mock/guild'

defineProps<{ honors: Honor[] }>()
</script>

<style scoped>
.honors-section {
  /* 由父级 snap-block 控制间距 */
}

.section-header {
  text-align: center;
  margin-bottom: 32px;
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

/* 时间线布局 */
.honors-timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.honor-item {
  display: flex;
  gap: 20px;
  animation: fadeSlideIn 0.5s ease both;
}

/* 时间线节点 */
.timeline-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 32px;
}

.node-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 10px rgba(201, 168, 124, 0.5);
  flex-shrink: 0;
  margin-top: 22px;
}

.node-line {
  width: 2px;
  flex: 1;
  min-height: 24px;
  background: linear-gradient(180deg, var(--color-accent), transparent);
}

/* 荣誉卡片 */
.honor-card {
  flex: 1;
  display: flex;
  gap: 16px;
  padding: 20px 24px;
  margin-bottom: 16px;
}

.honor-badge {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(201, 168, 124, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent);
  flex-shrink: 0;
}

.honor-content {
  flex: 1;
}

.honor-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 6px;
}

.honor-desc {
  font-size: 14px;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: 8px;
}

.honor-date {
  font-size: 12px;
  color: var(--color-accent-light);
}

@media (max-width: 768px) {
  .honor-item {
    gap: 12px;
  }
  .honor-card {
    padding: 16px;
  }
}
</style>
