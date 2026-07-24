<!--
  区块 D：招募与联系区（页面最底部）
  展示：招募信息（可选）+ 大当家联系方式
  需求文档 3.2 区块D
-->
<template>
  <section class="recruitment-section">
    <div class="section-header">
      <h2 class="section-title">招募 & 联系</h2>
      <div class="section-divider"></div>
    </div>

    <div class="recruit-grid">
      <!-- 招募信息（如果有） -->
      <div v-if="guild.recruitment" class="recruit-card card card-acrylic">
        <div class="recruit-status" :class="{ 'is-open': guild.recruitment.isRecruiting }">
          <span class="status-dot"></span>
          {{ guild.recruitment.isRecruiting ? '正在招募' : '暂不招募' }}
        </div>

        <p class="recruit-desc">{{ guild.recruitment.description }}</p>

        <div class="requirements">
          <h4 class="req-title">招募要求</h4>
          <ul class="req-list">
            <li v-for="(req, idx) in guild.recruitment.requirements" :key="idx">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20,6 9,17 4,12" />
              </svg>
              {{ req }}
            </li>
          </ul>
        </div>
      </div>

      <!-- 联系方式 -->
      <div class="contact-card card card-acrylic">
        <h3 class="contact-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" />
          </svg>
          联系大当家（{{ guild.leaderName }}）
        </h3>

        <div class="contact-list">
          <div v-if="guild.contact.wechat" class="contact-item">
            <span class="contact-label">微信</span>
            <span class="contact-value">{{ guild.contact.wechat }}</span>
          </div>
          <div v-if="guild.contact.qq" class="contact-item">
            <span class="contact-label">QQ</span>
            <span class="contact-value">{{ guild.contact.qq }}</span>
          </div>
          <div v-if="guild.contact.discord" class="contact-item">
            <span class="contact-label">Discord</span>
            <span class="contact-value">{{ guild.contact.discord }}</span>
          </div>
          <div v-if="guild.contact.message" class="contact-item contact-message">
            <span class="contact-label">留言</span>
            <span class="contact-value">{{ guild.contact.message }}</span>
          </div>
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
.recruitment-section {
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

.recruit-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* 招募卡片 */
.recruit-card {
  padding: 28px;
}

.recruit-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  padding: 6px 16px;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--color-text-muted);
  margin-bottom: 16px;
}

.recruit-status.is-open {
  background: rgba(76, 175, 80, 0.1);
  color: #81c784;
  border: 1px solid rgba(76, 175, 80, 0.2);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.recruit-desc {
  font-size: 14px;
  line-height: 1.8;
  color: var(--color-text-muted);
  margin-bottom: 20px;
}

.req-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 10px;
}

.req-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.req-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.req-list svg {
  flex-shrink: 0;
  margin-top: 2px;
  color: var(--color-accent);
}

/* 联系方式卡片 */
.contact-card {
  padding: 28px;
}

.contact-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 17px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
}

.contact-title svg {
  color: var(--color-accent);
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.contact-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-accent-light);
  min-width: 56px;
  padding: 3px 10px;
  border-radius: var(--radius-sm);
  background: rgba(201, 168, 124, 0.08);
  text-align: center;
}

.contact-value {
  font-size: 14px;
  color: var(--color-text);
  word-break: break-all;
}

.contact-message {
  align-items: flex-start;
  padding-top: 4px;
  border-top: 1px solid var(--color-border);
  margin-top: 4px;
}

.contact-message .contact-value {
  font-style: italic;
  color: var(--color-text-muted);
}

@media (max-width: 768px) {
  .recruit-grid {
    grid-template-columns: 1fr;
  }
}
</style>
