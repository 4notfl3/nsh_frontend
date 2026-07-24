<!--
  帮会列表页 —— 模块主入口
  需求文档 3.1：
    - 展示所有帮会，以小卡片网格形式排列
    - 提供"注册成为大当家"入口
    - 点击卡片 → 跳转帮会详情页
-->
<template>
  <div class="guild-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">帮会</h1>
      <p class="page-subtitle">江湖路远，择一帮为家</p>

      <!-- 注册大当家入口 -->
      <button
        v-if="canRegister"
        class="btn btn-primary register-btn"
        @click="showRegisterModal = true"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        注册成为大当家
      </button>
    </div>

    <!-- 加载中 -->
    <div v-if="loading" class="state-box">
      <div class="loading-spinner"></div>
      <p>加载帮会列表中…</p>
    </div>

    <!-- 空状态 -->
    <div v-else-if="guilds.length === 0" class="state-box">
      <div class="empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
      </div>
      <p class="empty-title">暂无帮会</p>
      <p class="empty-desc">还没有大当家创建帮会，成为第一个吧！</p>
    </div>

    <!-- 帮会卡片网格 -->
    <div v-else class="guild-grid">
      <GuildCard
        v-for="(guild, idx) in guilds"
        :key="guild.id"
        :guild="guild"
        :style="{ animationDelay: idx * 0.08 + 's' }"
      />
    </div>

    <!-- 注册大当家弹窗 -->
    <Teleport to="body">
      <transition name="modal">
        <div v-if="showRegisterModal" class="modal-overlay" @click.self="showRegisterModal = false">
          <div class="modal-card">
            <button class="modal-close" @click="showRegisterModal = false" title="关闭">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <h2 class="modal-title">注册成为大当家</h2>
            <p class="modal-desc">创建属于你自己的帮会，招募兄弟，征战江湖！</p>

            <form class="register-form" @submit.prevent="handleRegister">
              <div class="form-group">
                <label class="form-label">帮会名称 <span class="required">*</span></label>
                <input
                  v-model="form.guildName"
                  type="text"
                  class="form-input"
                  placeholder="为你的帮会取一个响亮的名字"
                  required
                  maxlength="20"
                />
              </div>

              <div class="form-group">
                <label class="form-label">帮会标语</label>
                <input
                  v-model="form.slogan"
                  type="text"
                  class="form-input"
                  placeholder="一句话介绍你的帮会"
                  maxlength="30"
                />
              </div>

              <div class="form-group">
                <label class="form-label">帮会简介</label>
                <textarea
                  v-model="form.description"
                  class="form-input form-textarea"
                  placeholder="详细介绍一下你的帮会吧…"
                  rows="3"
                  maxlength="500"
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">大当家昵称 <span class="required">*</span></label>
                <input
                  v-model="form.leaderName"
                  type="text"
                  class="form-input"
                  placeholder="你在江湖中的名号"
                  required
                  maxlength="12"
                />
              </div>

              <div class="form-group">
                <label class="form-label">联系方式</label>
                <input
                  v-model="form.contactInfo"
                  type="text"
                  class="form-input"
                  placeholder="微信 / QQ / 游戏内ID"
                  maxlength="50"
                />
              </div>

              <p v-if="registerError" class="form-error">{{ registerError }}</p>
              <p v-if="registerSuccess" class="form-success">{{ registerSuccess }}</p>

              <button type="submit" class="btn btn-primary form-submit" :disabled="submitting">
                {{ submitting ? '提交中…' : '确认注册' }}
              </button>
            </form>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { fetchGuildList, registerAsLeader } from '@/api/guild'
import type { Guild } from '@/mock/guild'
import GuildCard from '@/components/guild/GuildCard.vue'

// --- 状态 ---
const guilds = ref<Guild[]>([])
const loading = ref(true)

const userStore = useUserStore()

// 已登录且非游客才能注册成为大当家
const canRegister = computed(() => userStore.isLoggedIn && !userStore.isGuest)

// --- 加载帮会列表 ---
onMounted(async () => {
  try {
    const res = await fetchGuildList()
    guilds.value = res.list
  } catch (e) {
    console.error('获取帮会列表失败:', e)
  } finally {
    loading.value = false
  }
})

// --- 注册大当家弹窗 ---
const showRegisterModal = ref(false)
const submitting = ref(false)
const registerError = ref('')
const registerSuccess = ref('')

const form = ref({
  guildName: '',
  slogan: '',
  description: '',
  leaderName: userStore.nickname || '',
  contactInfo: '',
})

async function handleRegister() {
  registerError.value = ''
  registerSuccess.value = ''
  submitting.value = true

  try {
    const res = await registerAsLeader({
      guildName: form.value.guildName,
      slogan: form.value.slogan,
      description: form.value.description,
      leaderName: form.value.leaderName,
      contactInfo: { contact: form.value.contactInfo },
    })

    if (res.success) {
      registerSuccess.value = res.message || '注册成功！刷新页面后即可管理你的帮会。'
      // 关闭弹窗并刷新列表
      setTimeout(() => {
        showRegisterModal.value = false
        registerSuccess.value = ''
        // 重置表单
        form.value = { guildName: '', slogan: '', description: '', leaderName: userStore.nickname || '', contactInfo: '' }
        // 刷新列表
        fetchGuildList().then(r => { guilds.value = r.list })
      }, 1500)
    } else {
      registerError.value = res.message || '注册失败，请稍后重试'
    }
  } catch (e) {
    registerError.value = '请求失败，请检查网络'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.guild-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px 60px;
  animation: fadeSlideIn 0.5s ease both;
}

/* 页面头部 */
.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 36px;
  font-weight: 800;
  color: var(--color-text);
  letter-spacing: 4px;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 16px;
  color: var(--color-text-muted);
  margin-bottom: 24px;
}

.register-btn {
  padding: 10px 28px;
  font-size: 15px;
}

/* 状态框 */
.state-box {
  text-align: center;
  padding: 80px 24px;
  color: var(--color-text-muted);
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
  margin-top: 16px;
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 14px;
}

.loading-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  margin: 0 auto 16px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 帮会卡片网格 */
.guild-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

@media (max-width: 960px) {
  .guild-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .guild-grid {
    grid-template-columns: 1fr;
  }
  .page-title {
    font-size: 28px;
  }
}

/* --- 注册弹窗 --- */
.modal-overlay {
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

.modal-card {
  position: relative;
  max-width: 520px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  background: rgba(10, 15, 24, 0.88);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(201, 168, 124, 0.15);
  border-radius: var(--radius-lg);
  padding: 36px 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
}

.modal-close {
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

.modal-close:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text);
  text-align: center;
  margin-bottom: 6px;
}

.modal-desc {
  font-size: 14px;
  color: var(--color-text-muted);
  text-align: center;
  margin-bottom: 28px;
}

/* 表单 */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
}

.required {
  color: #f56c6c;
}

.form-input {
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.04);
  color: var(--color-text);
  font-size: 14px;
  font-family: inherit;
  transition: border-color var(--transition-fast);
  outline: none;
}

.form-input:focus {
  border-color: var(--color-accent);
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-error {
  font-size: 13px;
  color: #f56c6c;
  text-align: center;
}

.form-success {
  font-size: 13px;
  color: #81c784;
  text-align: center;
}

.form-submit {
  width: 100%;
  padding: 12px;
  font-size: 15px;
  justify-content: center;
  margin-top: 4px;
}

.form-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 弹窗动画 */
.modal-enter-active { transition: opacity 0.3s ease; }
.modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .modal-card {
  animation: modalIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
.modal-leave-active .modal-card {
  animation: modalOut 0.2s ease both;
}

@keyframes modalIn {
  from { opacity: 0; transform: scale(0.92) translateY(24px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes modalOut {
  to   { opacity: 0; transform: scale(0.95) translateY(12px); }
}
</style>
