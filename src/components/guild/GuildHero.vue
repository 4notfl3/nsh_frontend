<!--
  主视觉区：左侧伸缩成员面板 + 选中角色背景轮播 + 竖排语录
  鼠标滑到浏览器最左侧 → 成员面板滑出 | 离开面板 → 缩回
  点击成员 → 面板缩回，展示该成员背景图轮播 + 语录
  未选角色时 → 默认背景 /img/女儿壁纸.png
-->
<template>
  <section class="hero-section">
    <!-- 背景轮播 -->
    <div class="hero-bg-wrap">
      <div
        v-for="(bg, i) in currentBgs"
        :key="i"
        class="hero-bg"
        :class="{ active: i === bgIdx }"
        :style="{ backgroundImage: 'url(' + bg + ')' }"
      ></div>
      <div class="hero-bg-overlay"></div>
    </div>

    <!-- 左侧边缘触发区 -->
    <div class="edge-trigger" @mouseenter="panelOpen = true"></div>

    <!-- 左侧伸缩成员面板 -->
    <transition name="panel-slide">
      <div v-if="panelOpen" class="member-panel" @mouseleave="panelOpen = false">
        <div class="panel-scroll">
          <div
            v-for="m in guild.members"
            :key="m.id"
            class="member-item"
            :class="{ selected: selectedMember?.id === m.id }"
            @click="selectMember(m)"
          >
            <div class="member-avatar">
              <img :src="m.avatar" :alt="m.name" />
            </div>
            <span class="member-name">{{ m.name }}</span>
          </div>
        </div>
      </div>
    </transition>

    <!-- 选中角色信息（左侧文字） -->
    <div v-if="selectedMember" class="hero-info">
      <h1 class="hero-name">{{ selectedMember.name }}</h1>
      <p class="hero-title-text">{{ selectedMember.title }}</p>
      <div class="hero-quotes">
        <div class="quote-col" v-for="(col, ci) in quoteCols" :key="ci"
          :style="{ paddingTop: ci % 2 === 0 ? '0' : '20px' }">
          <span v-for="(ch, chi) in col" :key="chi" class="quote-char">{{ ch }}</span>
        </div>
      </div>
      <p class="hero-intro">{{ selectedMember.intro }}</p>
    </div>

    <!-- 帮会名（未选角色时显示） -->
    <div v-else class="hero-default-title">
      <h1>{{ guild.name }}</h1>
      <p>{{ guild.slogan }}</p>
    </div>

    <!-- 背景轮播指示器 -->
    <div v-if="selectedMember && currentBgs.length > 1" class="bg-dots">
      <button v-for="(_, i) in currentBgs" :key="i"
        class="bg-dot" :class="{ active: i === bgIdx }"
        @click="bgIdx = i" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { Guild, Member } from '@/mock/guild'

const props = defineProps<{ guild: Guild }>()
const emit = defineEmits<{ updateBg: [bg: string] }>()

const BG_DEFAULT = '/banghui/攻略组卡片背景.jpg'

const panelOpen = ref(false)
const selectedMember = ref<Member | null>(null)
const bgIdx = ref(0)
let carouselTimer: ReturnType<typeof setInterval> | undefined

const currentBgs = computed(() => selectedMember.value?.bgImages?.length
  ? selectedMember.value.bgImages
  : [BG_DEFAULT])

// 竖排语录：每段 quote 就是一列，不拆开
const quoteCols = computed(() => {
  const quotes = selectedMember.value?.quotes || []
  return quotes.map(q => q.split(''))
})

// 更新轮播（未选则默认图，选了则循环角色图）
const currentBg = computed(() => currentBgs.value[bgIdx.value] || BG_DEFAULT)

// 背景同步到父级
watch(currentBg, (bg) => emit('updateBg', bg), { immediate: true })

function selectMember(m: Member) {
  if (selectedMember.value?.id === m.id) return
  selectedMember.value = m
  bgIdx.value = 0
  panelOpen.value = false
  startCarousel()
}

// 轮播定时器
function startCarousel() {
  clearInterval(carouselTimer)
  if (currentBgs.value.length <= 1) return
  carouselTimer = setInterval(() => {
    bgIdx.value = (bgIdx.value + 1) % currentBgs.value.length
  }, 5000)
}
watch(currentBgs, startCarousel)

onMounted(() => startCarousel())
onUnmounted(() => clearInterval(carouselTimer))
</script>

<style scoped>
.hero-section { position: relative; width: 100%; height: 100%; overflow: hidden; }

/* ====== 背景轮播 ====== */
.hero-bg-wrap { position: absolute; inset: 0; z-index: 0; }
.hero-bg {
  position: absolute; inset: 0;
  background: center/cover no-repeat;
  opacity: 0; transition: opacity 1.2s ease;
}
.hero-bg.active { opacity: 1; }
.hero-bg-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.3) 100%);
}

/* ====== 左侧触发区 ====== */
.edge-trigger { position: absolute; left: 0; top: 0; bottom: 0; width: 8px; z-index: 20; }

/* ====== 左侧成员面板 ====== */
.member-panel {
  position: absolute; left: 0; top: 12px; bottom: 12px;
  width: 25vw; min-width: 200px; max-width: 320px; z-index: 30;
  background: rgba(15,20,30,0.82);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255,255,255,0.08);
  border-radius: 0 12px 12px 0;
  display: flex; flex-direction: column;
  overflow: hidden;
}
.panel-scroll {
  flex: 1; overflow-y: auto; padding: 16px 12px;
  display: grid; grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 12px; align-content: start;
  scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent;
}
.member-item {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  cursor: pointer; transition: transform 0.2s, opacity 0.2s;
  padding: 6px 4px; border-radius: 8px;
}
.member-item:hover { transform: scale(1.08); background: rgba(255,255,255,0.06); }
.member-item.selected { background: rgba(201,168,124,0.15); border: 1px solid rgba(201,168,124,0.3); }
.member-avatar {
  width: 52px; height: 52px; border-radius: 6px; overflow: hidden;
  border: 1px solid rgba(255,255,255,0.12);
}
.member-avatar img { width: 100%; height: 100%; object-fit: cover; }
.member-name { font-size: 11px; color: rgba(255,255,255,0.7); text-align: center; line-height: 1.2; }

/* 面板滑入/滑出动画 */
.panel-slide-enter-active { transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
.panel-slide-leave-active { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.panel-slide-enter-from, .panel-slide-leave-to { transform: translateX(-100%); }

/* ====== 左侧文字信息 ====== */
.hero-info { position: absolute; inset: 0; z-index: 10; padding: 48px 0 48px 40px; display: flex; flex-direction: column; pointer-events: none; }
.hero-name {
  font-size: 56px; font-weight: 900; color: #fff;
  letter-spacing: 12px; text-shadow: 0 4px 20px rgba(0,0,0,0.6);
  margin-bottom: 4px;
}
.hero-title-text {
  font-size: 15px; color: var(--color-accent-light);
  letter-spacing: 4px; margin-bottom: 28px;
}
.hero-intro {
  margin-top: auto;
  font-size: 23px; color: rgba(255,255,255,0.45);
  max-width: 320px; line-height: 1.7;
  letter-spacing: 1px;
}
.hero-quotes { display: flex; gap: 8px; }
.quote-col { display: flex; flex-direction: column; gap: 4px; }
.quote-char {
  font-size: 18px; color: rgba(255,255,255,0.65);
  font-family: FangSong, STFangsong, serif;
  text-shadow: 0 1px 6px rgba(0,0,0,0.5);
  width: 24px; text-align: center; line-height: 1.6;
}

/* ====== 默认标题 ====== */
.hero-default-title {
  position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
  z-index: 10; text-align: center; pointer-events: none;
}
.hero-default-title h1 { font-size: 48px; font-weight: 800; color: #fff; letter-spacing: 12px; text-shadow: 0 4px 20px rgba(0,0,0,0.6); }
.hero-default-title p { font-size: 18px; color: var(--color-accent-light); margin-top: 12px; }

/* ====== 轮播指示器 ====== */
.bg-dots { position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 10; display: flex; gap: 8px; }
.bg-dot {
  width: 8px; height: 8px; border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,0.3); background: transparent;
  cursor: pointer; padding: 0; transition: all 0.3s;
}
.bg-dot.active { background: #fff; border-color: #fff; transform: scale(1.3); }

@media (max-width: 768px) {
  .member-panel { width: 60vw; }
  .hero-name { font-size: 36px; letter-spacing: 6px; }
  .hero-info { padding-left: 20px; }
  .hero-default-title h1 { font-size: 32px; }
}
</style>
