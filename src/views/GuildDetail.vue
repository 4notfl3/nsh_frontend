<!-- 帮会详情页 — 沉浸式逐屏浏览 -->
<template>
  <div v-if="loading || !guild" class="detail-placeholder">
    <div v-if="loading" class="state-box">
      <div class="loading-spinner"></div><p>加载帮会信息中…</p>
    </div>
    <div v-else class="state-box">
      <p class="empty-title">帮会不存在</p>
      <p class="empty-desc">该帮会可能已被删除，或你访问的链接有误。</p>
      <router-link to="/guild" class="btn btn-outline" style="margin-top:20px">返回帮会列表</router-link>
    </div>
  </div>

  <div v-else class="detail-wrapper">
    <div class="detail-bg-layer" :style="{ backgroundImage: 'url(' + heroBg + ')' }"></div>
    <div class="detail-bg-overlay"></div>
    <div ref="shellRef" class="detail-shell">
    <div class="scroll-inner">
      <!-- Block 0: 人物合影 -->
      <section class="snap-block"><div class="block-inner"><GuildHero :guild="guild" @select-member="openMemberPopup" @update-bg="onUpdateBg" /></div></section>
      <!-- Block 1: 帮会介绍 -->
      <section class="snap-block"><div class="block-inner"><GuildIntroText :guild="guild" /></div></section>
      <!-- Block 2: 集体合照 -->
      <section class="snap-block"><div class="block-inner"><GuildGroupPhoto :guild="guild" /></div></section>
      <!-- Block 3: 照片墙 -->
      <section class="snap-block"><div class="block-inner photo-wall-inner">
        <div class="section-header"><h2 class="section-title">帮会照片墙</h2><div class="section-divider"></div></div>
        <div class="photo-wall-viewport"><PhotoWall :photos="guild.photoWall" /></div>
      </div></section>
      <!-- Block 4: 荣誉 -->
      <section v-if="guild.honors.length" class="snap-block"><div class="block-inner"><GuildHonors :honors="guild.honors" /></div></section>
      <!-- Block 5: 招募 -->
      <section class="snap-block"><div class="block-inner"><GuildRecruitment :guild="guild" /></div></section>
      <!-- 终点 -->
      <section class="snap-block"><div class="block-inner end-content">
        <div class="section-divider"></div>
        <p class="end-hint">— 已浏览全部内容 —</p>
        <router-link to="/guild" class="btn btn-outline end-btn">← 返回帮会列表</router-link>
      </div></section>
    </div>
    </div>

    <nav v-if="blockCount" class="side-dots">
      <button v-for="i in blockCount" :key="i" class="side-dot"
        :class="{ 'is-active': i-1 === activeBlock, 'is-viewed': i-1 < activeBlock }"
        @click="goToBlock(i-1)" />
    </nav>
  </div>

  <MemberPopup v-if="selectedMember" :member="selectedMember" :visible="showMemberPopup" @close="showMemberPopup = false" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { fetchGuildDetail } from '@/api/guild'
import type { Guild, Member } from '@/mock/guild'
import GuildHero from '@/components/guild/GuildHero.vue'
import GuildIntroText from '@/components/guild/GuildIntroText.vue'
import GuildGroupPhoto from '@/components/guild/GuildGroupPhoto.vue'
import PhotoWall from '@/components/guild/PhotoWall.vue'
import GuildHonors from '@/components/guild/GuildHonors.vue'
import GuildRecruitment from '@/components/guild/GuildRecruitment.vue'
import MemberPopup from '@/components/guild/MemberPopup.vue'

const route = useRoute()
const guild = ref<Guild | null>(null)
const loading = ref(true)
const selectedMember = ref<Member | null>(null)
const showMemberPopup = ref(false)
const heroBg = ref('/img/女儿壁纸.png')
const onUpdateBg = (bg: string) => { heroBg.value = bg }

const shellRef = ref<HTMLElement | null>(null)
const activeBlock = ref(0)
const blockCount = ref(0)
let blockEls: HTMLElement[] = []
let observer: IntersectionObserver | null = null

function collectBlocks() {
  if (!shellRef.value) return
  blockEls = Array.from(shellRef.value.querySelectorAll<HTMLElement>('.scroll-inner .snap-block'))
  blockCount.value = blockEls.length
}

function setupObserver() {
  observer?.disconnect()
  if (!shellRef.value || !blockEls.length) return
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target as HTMLElement
      el.classList.toggle('is-active', entry.isIntersecting && entry.intersectionRatio >= 0.6)
      if (entry.isIntersecting && entry.intersectionRatio >= 0.6) activeBlock.value = blockEls.indexOf(el)
    })
  }, { root: shellRef.value, threshold: 0.6 })
  blockEls.forEach(el => observer!.observe(el))
}

function goToBlock(idx: number) {
  blockEls[Math.min(Math.max(idx, 0), blockEls.length - 1)]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function openMemberPopup(member: Member) { selectedMember.value = member; showMemberPopup.value = true }

onMounted(async () => {
  const id = Number(route.params.id)
  if (!id || isNaN(id)) { loading.value = false; return }
  try { guild.value = await fetchGuildDetail(id) }
  catch (e) { console.error('获取帮会详情失败:', e) }
  finally { loading.value = false; await nextTick(); collectBlocks(); setupObserver() }
})

onMounted(() => window.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    if (['INPUT','TEXTAREA'].includes((e.target as HTMLElement)?.tagName ?? '')) return
    e.preventDefault()
    goToBlock(activeBlock.value + (e.key === 'ArrowDown' ? 1 : -1))
  }
}))

onUnmounted(() => observer?.disconnect())
</script>

<style scoped>
.detail-wrapper { position: relative; }
.detail-bg-layer {
  position: fixed; inset: 0; z-index: 1;
  background-color: #0a0e16; background-position: center;
  background-size: cover; background-repeat: no-repeat;
  transition: background-image 0.8s ease;
}
.detail-bg-overlay {
  position: fixed; inset: 0; z-index: 1;
  background: linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 45%, rgba(0,0,0,0.5) 100%);
  pointer-events: none;
}

/* 滚动容器 */
.detail-shell {
  position: fixed; inset: 0; z-index: 3;
  overflow-y: auto; overflow-x: hidden;
  scroll-snap-type: y mandatory; scroll-behavior: smooth;
  scrollbar-width: none;
  animation: immersiveEnter 1.2s ease both;
}
.detail-shell::-webkit-scrollbar { display: none; }
@keyframes immersiveEnter {
  0% { opacity: 0; filter: brightness(0.15) blur(4px); }
  100% { opacity: 1; filter: brightness(1) blur(0); }
}

.snap-block {
  height: 100vh; height: 100svh;
  scroll-snap-align: start; scroll-snap-stop: always;
  overflow: hidden; position: relative;
}

.block-inner {
  width: 100%; height: 100%;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  opacity: 0; transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  will-change: opacity, transform;
}
.snap-block.is-active .block-inner { opacity: 1; transform: translateY(0); }

.photo-wall-inner { padding: 0 24px; }
.section-header { flex-shrink: 0; text-align: center; margin-bottom: 20px; }
.section-title { font-size: 26px; font-weight: 700; letter-spacing: 2px; margin-bottom: 12px; }
.section-divider { width: 60px; height: 2px; margin: 0 auto; background: linear-gradient(90deg, transparent, var(--color-accent), transparent); }
.photo-wall-viewport { width: 100%; max-width: 960px; flex: 1; min-height: 0; overflow: hidden; display: flex; align-items: center; justify-content: center; }

.end-content { text-align: center; }
.end-content .section-divider { margin-bottom: 24px; }
.end-hint { font-size: 14px; color: var(--color-text-muted); margin-bottom: 20px; letter-spacing: 2px; }
.end-btn { padding: 12px 32px; font-size: 15px; }

.scroll-inner { position: relative; }
.side-dots { position: fixed; right: 20px; top: 50%; transform: translateY(-50%); z-index: 50; display: flex; flex-direction: column; gap: 12px; }
.side-dot { width: 10px; height: 10px; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.25); background: transparent; cursor: pointer; padding: 0; transition: all 0.4s ease; }
.side-dot.is-viewed { border-color: rgba(201,168,124,0.5); background: rgba(201,168,124,0.3); }
.side-dot.is-active { border-color: var(--color-accent); background: var(--color-accent); box-shadow: 0 0 14px rgba(201,168,124,0.55); transform: scale(1.35); }
.side-dot:hover { border-color: var(--color-accent-light); }

.detail-placeholder { display: flex; align-items: center; justify-content: center; min-height: 100vh; min-height: 100svh; }
.state-box { text-align: center; padding: 60px 24px; color: var(--color-text-muted); }
.empty-title { font-size: 20px; font-weight: 600; margin-bottom: 8px; }
.empty-desc { font-size: 14px; }
.loading-spinner { width: 36px; height: 36px; border: 3px solid rgba(255,255,255,0.1); border-top-color: var(--color-accent); border-radius: 50%; margin: 0 auto 16px; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 768px) {
  .block-inner { transform: translateY(18px); }
  .side-dots { right: 8px; gap: 10px; }
  .side-dot { width: 7px; height: 7px; }
  .photo-wall-inner { padding: 0 16px; }
}
</style>
