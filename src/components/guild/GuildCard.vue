<!--
  帮会列表小卡片
  展示：帮会logo、名称、标语、人数、简介摘要
  点击跳转详情页
-->
<template>
  <router-link :to="`/guild/${guild.id}`" class="guild-card card card-acrylic lift-on-hover">
    <!-- 头图 -->
    <div class="card-banner">
      <img :src="guild.logo" :alt="guild.name" class="card-logo" loading="lazy" />
      <div class="card-member-count">
        <span class="count-num">{{ guild.members?.length ?? guild.memberCount }}</span>
        <span class="count-label">成员</span>
      </div>
    </div>

    <!-- 信息区 -->
    <div class="card-body">
      <h3 class="card-name">{{ guild.name }}</h3>
      <p class="card-slogan">{{ guild.slogan }}</p>
      <p class="card-desc">{{ truncatedDesc }}</p>
    </div>

    <!-- 底部 -->
    <div class="card-footer">
      <span class="card-leader">大当家：{{ guild.leaderName }}</span>
      <span class="card-arrow">查看详情 →</span>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Guild } from '@/mock/guild'

const props = defineProps<{ guild: Guild }>()

const truncatedDesc = computed(() => {
  const d = props.guild.description
  return d.length > 60 ? d.slice(0, 60) + '…' : d
})
</script>

<style scoped>
.guild-card {
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  text-decoration: none;
  animation: fadeSlideIn 0.5s ease both;
  height: 100%;
}

.card-banner {
  position: relative;
  aspect-ratio: 16 / 9;
  background: linear-gradient(135deg, rgba(201, 168, 124, 0.15), rgba(201, 168, 124, 0.03));
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.card-logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(201, 168, 124, 0.4);
  box-shadow: 0 0 20px rgba(201, 168, 124, 0.15);
  transition: transform var(--transition-smooth);
}

.guild-card:hover .card-logo {
  transform: scale(1.08);
}

.card-member-count {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: baseline;
  gap: 2px;
  padding: 4px 10px;
  background: rgba(0, 0, 0, 0.55);
  border-radius: 100px;
  backdrop-filter: blur(4px);
}

.count-num {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-accent-light);
}

.count-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.55);
}

.card-body {
  padding: 16px 20px 12px;
  flex: 1;
}

.card-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 4px;
}

.card-slogan {
  font-size: 13px;
  color: var(--color-accent-light);
  margin-bottom: 10px;
  font-style: italic;
}

.card-desc {
  font-size: 13px;
  color: var(--color-text-muted);
  line-height: 1.6;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-top: 1px solid var(--color-border);
  font-size: 12px;
}

.card-leader {
  color: var(--color-text-muted);
}

.card-arrow {
  color: var(--color-accent);
  font-weight: 500;
  transition: transform var(--transition-fast);
}

.guild-card:hover .card-arrow {
  transform: translateX(4px);
}
</style>
