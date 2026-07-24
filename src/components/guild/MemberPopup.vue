<!--
  成员详情弹窗
  需求文档 3.2 区块A：点击合照中的成员 → 弹出成员详细信息卡片
-->
<template>
  <Teleport to="body">
    <transition name="popup">
      <div v-if="visible" class="popup-overlay" @click.self="$emit('close')">
        <div class="popup-card" @click.stop>
          <!-- 关闭按钮 -->
          <button class="popup-close" @click="$emit('close')" title="关闭">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <!-- 成员头像 -->
          <div class="popup-avatar-wrap">
            <img :src="member.avatar" :alt="member.name" class="popup-avatar" />
          </div>

          <!-- 成员信息 -->
          <div class="popup-info">
            <h3 class="popup-name">{{ member.name }}</h3>
            <span class="popup-title">{{ member.title }}</span>
            <p class="popup-intro">{{ member.intro }}</p>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Member } from '@/mock/guild'

defineProps<{
  member: Member
  visible: boolean
}>()

defineEmits<{
  close: []
}>()
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(8px);
  padding: 24px;
}

.popup-card {
  position: relative;
  max-width: 420px;
  width: 100%;
  background: rgba(10, 15, 24, 0.85);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(201, 168, 124, 0.2);
  border-radius: var(--radius-lg);
  padding: 40px 32px 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  text-align: center;
}

.popup-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.4);
  transition: all var(--transition-fast);
  background: transparent;
  border: none;
  cursor: pointer;
}

.popup-close:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}

.popup-avatar-wrap {
  margin-bottom: 20px;
}

.popup-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(201, 168, 124, 0.5);
  box-shadow: 0 0 30px rgba(201, 168, 124, 0.2);
}

.popup-name {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 6px;
}

.popup-title {
  display: inline-block;
  font-size: 13px;
  color: var(--color-accent-light);
  padding: 3px 14px;
  border-radius: 100px;
  background: rgba(201, 168, 124, 0.1);
  border: 1px solid rgba(201, 168, 124, 0.2);
  margin-bottom: 18px;
}

.popup-intro {
  font-size: 14px;
  color: var(--color-text-muted);
  line-height: 1.8;
  text-align: left;
}

/* 动画 */
.popup-enter-active {
  transition: opacity 0.3s ease;
}

.popup-leave-active {
  transition: opacity 0.25s ease;
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
}

.popup-enter-active .popup-card {
  animation: popupIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.popup-leave-active .popup-card {
  animation: popupOut 0.2s ease both;
}

@keyframes popupIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes popupOut {
  to {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
}
</style>
