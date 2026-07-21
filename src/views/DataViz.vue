<!--
  数据可视化页面
  - 两边阵营概况对比（仗剑 vs 横戈）
  - 点击职业数弹出职业分布详情
  - 雷达图：同职业多玩家对比（可多选）
  - 柱状图：全阵营击败排名
-->
<template>
  <div class="dataviz">
    <!-- 页头 -->
    <div class="dv-header">
      <h1>📊 帮战数据可视化</h1>
      <p>上传 CSV 数据文件，自动解析并按阵营/职业对比玩家表现</p>
    </div>

    <!-- 文件上传区 -->
    <div
      class="upload-zone"
      :class="{ dragover: isDragover }"
      @click="triggerUpload"
      @dragover.prevent="isDragover = true"
      @dragleave="isDragover = false"
      @drop.prevent="onDrop"
    >
      <div class="uz-icon">📂</div>
      <div class="uz-text">📁 点击选择文件或拖拽 CSV 到此处</div>
      <div class="uz-hint">支持逆水寒约战导出的 CSV 格式数据</div>
      <input ref="fileInput" type="file" accept=".csv" hidden @change="onFileChange">
      <div v-if="fileName" class="file-info">✅ 已加载: {{ fileName }}</div>
    </div>

    <template v-if="rawData">
      <!-- ========== 两边阵营概况对比 ========== -->
      <div class="vs-summary">
        <div
          v-for="side in matchNames" :key="side"
          class="vs-column"
        >
          <div class="vs-title">{{ side }}</div>
          <div class="vs-cards">
            <div class="vs-card">
              <div class="vs-num">{{ sideStats[side]?.total || 0 }}</div>
              <div class="vs-lbl">总人数</div>
            </div>
            <div class="vs-card clickable" @click="openClassModal">
              <div class="vs-num">{{ sideStats[side]?.classCount || 0 }}</div>
              <div class="vs-lbl">职业数 ▸</div>
            </div>
            <div class="vs-card">
              <div class="vs-num">{{ sideStats[side]?.kills || 0 }}</div>
              <div class="vs-lbl">总击败</div>
            </div>
            <div class="vs-card">
              <div class="vs-num">{{ sideStats[side]?.assists || 0 }}</div>
              <div class="vs-lbl">总助攻</div>
            </div>
            <div class="vs-card">
              <div class="vs-num">{{ sideStats[side]?.deaths || 0 }}</div>
              <div class="vs-lbl">总重伤</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 对阵选择 Tab -->
      <div class="controls">
        <label>🏁 选择查看阵营：</label>
        <button
          v-for="m in matchNames" :key="m"
          class="tab-btn"
          :class="{ active: currentMatch === m }"
          @click="selectMatch(m)"
        >{{ m }} ({{ rawData[m]?.length || 0 }}人)</button>

        <label style="margin-left:16px">📋 职业：</label>
        <select v-model="currentClass" @change="onClassChange">
          <option v-for="c in currentClassList" :key="c" :value="c">
            {{ CLASS_ICONS[c] || '' }} {{ c }}
          </option>
        </select>
      </div>

      <!-- ========== 图表区 ========== -->
      <div class="charts-area">
        <!-- 雷达图 -->
        <div class="card chart-section">
          <h2>📡 同职业多玩家 · 雷达图</h2>
          <p class="subtitle">点击下方玩家名字可多选对比，再次点击取消</p>
          <div id="radarChart" class="chart-box tall"></div>
          <!-- 玩家选择标签（由 renderPlayerTags 动态渲染） -->
          <div id="playerTags" class="player-tags"></div>
        </div>

        <!-- 柱状图：全阵营指标排名 -->
        <div class="card chart-section">
          <h2>📊 全阵营 · 指标排名</h2>
          <p class="subtitle">点击柱子可将该玩家加入雷达图对比（需属于当前所选职业）</p>
          <!-- 指标切换按钮 -->
          <div class="metric-bar">
            <button
              v-for="m in BAR_METRICS" :key="m.key"
              class="metric-btn"
              :class="{ active: barMetric === m.key }"
              @click="switchBarMetric(m.key)"
            >{{ m.label }}</button>
          </div>
          <div id="barChart" class="chart-box"></div>
          <!-- 职业图例 -->
          <div class="class-legend">
            <span v-for="c in currentClassList" :key="c" class="legend-item">
              <span class="legend-dot" :style="{ background: CLASS_COLORS[c] || '#999' }"></span>
              {{ c }}
            </span>
          </div>
        </div>
      </div>

      <!-- ========== 职业分布弹窗 ========== -->
      <teleport to="body">
        <div v-if="showClassModal" class="modal-overlay" @click.self="showClassModal = false">
          <div class="modal-card">
            <div class="modal-header">
              <h3>📋 两边阵营职业分布</h3>
              <button class="modal-close" @click="showClassModal = false">✕</button>
            </div>
            <div class="modal-body">
              <table class="class-table">
                <thead>
                  <tr>
                    <th>职业</th>
                    <th v-for="m in matchNames" :key="m">{{ m }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="c in allClasses" :key="c">
                    <td>
                      <span class="class-dot" :style="{ background: CLASS_COLORS[c] || '#999' }"></span>
                      {{ CLASS_ICONS[c] || '' }} {{ c }}
                    </td>
                    <td v-for="m in matchNames" :key="m">
                      {{ classDistribution[m]?.[c] || '-' }}
                    </td>
                  </tr>
                  <tr class="total-row">
                    <td><strong>合计</strong></td>
                    <td v-for="m in matchNames" :key="m">
                      <strong>{{ rawData[m]?.length || 0 }}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </teleport>
    </template>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <div class="icon">📊</div>
      <p>等待数据载入…<br>点击上传区域选择 CSV 文件</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { parseCSV, normalizePlayer, groupByClass } from '@/utils/csv'
import { fmtNum } from '@/utils/format'
import type { RawPlayer, NormalizedPlayer, MatchRawData, ClassGroups } from '@/utils/csv'

// ==================== 常量 ====================
const RADAR_METRICS = [
  { key: 'totalKills', label: '击败/清泉' }, { key: 'assists', label: '助攻' },
  { key: 'playerDmg', label: '对玩家伤害' }, { key: 'playerDmgArmor', label: '人伤卸甲' },
  { key: 'buildingDmg', label: '对建筑伤害' }, { key: 'buildingDmgArmor', label: '破塔卸甲' },
  { key: 'healing', label: '治疗值' }, { key: 'takenDmg', label: '承受伤害' },
  { key: 'deaths', label: '重伤' }, { key: 'revives', label: '复活/清泉' },
  { key: 'boneBurn', label: '焚骨' },
] as const

/** 柱状图可切换的指标 */
const BAR_METRICS = [
  { key: 'totalKills', label: '击败' }, { key: 'assists', label: '助攻' },
  { key: 'playerDmg', label: '对玩家伤害' }, { key: 'playerDmgArmor', label: '人伤卸甲' },
  { key: 'buildingDmg', label: '对建筑伤害' }, { key: 'buildingDmgArmor', label: '破塔卸甲' },
  { key: 'healing', label: '治疗值' }, { key: 'takenDmg', label: '承受伤害' },
  { key: 'deaths', label: '重伤' }, { key: 'revives', label: '复活/清泉' },
  { key: 'boneBurn', label: '焚骨' },
] as const

const CLASS_ORDER = ['铁衣','血河','碎梦','龙吟','沧澜','神相','玄机','潮光','九灵','素问','鸿音']

const CLASS_ICONS: Record<string,string> = {
  '铁衣':'🛡️','血河':'⚔️','碎梦':'🗡️','龙吟':'🐉','沧澜':'🌊',
  '神相':'🔮','玄机':'⚙️','潮光':'🌅','九灵':'💀','素问':'💊','鸿音':'🎵',
}

const CLASS_COLORS: Record<string,string> = {
  '碎梦':'#A9EBEA','血河':'#D95659','神相':'#4B6BF4','素问':'#F2A5A3',
  '铁衣':'#F6B269','九灵':'#9857F8','龙吟':'#81FBC8','玄机':'#F2E79D',
  '鸿音':'#F8C909','潮光':'#7FBFFF','沧澜':'#A2B6FB',
}

const PLAYER_COLORS = [
  '#e6194b','#3cb44b','#ffe119','#4363d8','#f58231','#911eb4',
  '#42d4f4','#f032e6','#bfef45','#fabed4','#469990','#dcbeff',
  '#9a6324','#800000','#aaffc3','#808000','#ffd8b1','#000075','#a9a9a9','#e6beff',
]

// ==================== 状态 ====================
// Vue 模板绑定的状态
const fileInput = ref<HTMLInputElement>()
const isDragover = ref(false)
const fileName = ref('')
const rawData = ref<MatchRawData | null>(null)
const currentMatch = ref('')
const currentClass = ref('')
const barMetric = ref('totalKills')
const showClassModal = ref(false)

// ===== 图表专用状态（plain JS，匹配原始 index.html） =====
let classPlayers: NormalizedPlayer[] = []     // 当前职业的玩家列表
let selectedPlayers = new Set<string>()        // 选中的玩家名
let radarChart: echarts.ECharts | null = null
let barChart: echarts.ECharts | null = null

// ==================== 计算属性（模板绑定） ====================

const matchNames = computed<string[]>(() => {
  if (!rawData.value) return []
  return Object.keys(rawData.value)
})

const currentMatchData = computed<RawPlayer[]>(() => {
  if (!rawData.value || !currentMatch.value) return []
  return rawData.value[currentMatch.value] || []
})

const currentGroups = computed<ClassGroups>(() => {
  return groupByClass(currentMatchData.value)
})

const currentClassList = computed<string[]>(() => {
  return Object.keys(currentGroups.value).sort((a, b) => {
    const ai = CLASS_ORDER.indexOf(a), bi = CLASS_ORDER.indexOf(b)
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
  })
})

/** 所有对阵的统计概览 */
const sideStats = computed<Record<string, { total: number; classCount: number; kills: number; assists: number; deaths: number }>>(() => {
  const stats: Record<string, any> = {}
  if (!rawData.value) return stats
  for (const [name, players] of Object.entries(rawData.value)) {
    const normalized = players.map(normalizePlayer)
    const groups = groupByClass(players)
    stats[name] = {
      total: normalized.length,
      classCount: Object.keys(groups).length,
      kills: normalized.reduce((s, p) => s + p.totalKills, 0),
      assists: normalized.reduce((s, p) => s + p.assists, 0),
      deaths: normalized.reduce((s, p) => s + p.deaths, 0),
    }
  }
  return stats
})

/** 所有对阵中出现过的全部职业（合并去重） */
const allClasses = computed<string[]>(() => {
  const set = new Set<string>()
  if (!rawData.value) return []
  for (const players of Object.values(rawData.value)) {
    const groups = groupByClass(players)
    Object.keys(groups).forEach(c => set.add(c))
  }
  return [...set].sort((a, b) => {
    const ai = CLASS_ORDER.indexOf(a), bi = CLASS_ORDER.indexOf(b)
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
  })
})

/** 各对阵的职业人数分布 */
const classDistribution = computed<Record<string, Record<string, number>>>(() => {
  const dist: Record<string, Record<string, number>> = {}
  if (!rawData.value) return dist
  for (const [name, players] of Object.entries(rawData.value)) {
    const groups = groupByClass(players)
    dist[name] = {}
    for (const [cls, pList] of Object.entries(groups)) {
      dist[name]![cls] = pList.length
    }
  }
  return dist
})

// ==================== 文件处理 ====================
function triggerUpload() { fileInput.value?.click() }
function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) handleFile(file)
}
function onDrop(e: DragEvent) {
  isDragover.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file?.name && file.size > 0) handleFile(file)
}

function handleFile(file: File) {
  const reader = new FileReader()
  reader.onload = (ev) => {
    try {
      const text = ev.target?.result as string
      if (!text?.trim()) { alert('文件为空，无法解析'); return }
      const data = parseCSV(text)
      if (!Object.keys(data).length) { alert('无法解析文件，请确认为正确的约战 CSV 格式'); return }

      rawData.value = data
      fileName.value = `${file.name} (${Object.keys(data).length} 场对阵)`
      selectedPlayers = new Set()

      currentMatch.value = Object.keys(data)[0] || ''

      nextTick(() => {
        const cl = currentClassList.value
        currentClass.value = cl[0] || ''
        renderAll()
      })
    } catch (ex) { alert('解析出错: ' + (ex as Error).message) }
  }
  reader.onerror = () => alert('读取文件失败')
  reader.readAsText(file)
}

// ==================== 交互 ====================
function selectMatch(m: string) {
  currentMatch.value = m
  selectedPlayers = new Set()
  const cl = currentClassList.value
  currentClass.value = cl[0] || ''
  nextTick(renderAll)
}

function onClassChange() {
  selectedPlayers = new Set()
  nextTick(renderAll)
}

function switchBarMetric(key: string) {
  barMetric.value = key
  nextTick(renderBar)
}

function openClassModal() { showClassModal.value = true }

// ==================== 渲染函数（与原始 index.html 完全一致） ====================
function renderAll() {
  if (!rawData.value || !currentMatch.value) return
  const groups = currentGroups.value
  if (!currentClass.value || !groups[currentClass.value]) {
    const cl = currentClassList.value
    if (cl.length) { currentClass.value = cl[0] } else return
  }
  classPlayers = groups[currentClass.value] || []

  // 修剪已不存在的玩家
  const names = new Set(classPlayers.map(p => p.name))
  for (const n of selectedPlayers) if (!names.has(n)) selectedPlayers.delete(n)
  if (selectedPlayers.size === 0 && classPlayers.length > 0) selectedPlayers.add(classPlayers[0]!.name)

  renderRadar()
  renderBar()
}

function renderRadar() {
  const container = document.getElementById('radarChart')
  if (!container || classPlayers.length === 0) return
  if (radarChart) radarChart.dispose()
  radarChart = echarts.init(container, null, { renderer: 'canvas' })

  const showPlayers = classPlayers.filter(p => selectedPlayers.has(p.name))
  if (showPlayers.length === 0) {
    radarChart.setOption({ title: { text: '请选择至少一个玩家', textStyle: { color: '#999' } } })
    renderPlayerTags()
    return
  }

  // Per-axis max & class average
  const maxVals: Record<string, number> = {}
  const classAvg: Record<string, number> = {}
  RADAR_METRICS.forEach(m => {
    maxVals[m.key] = Math.max(...classPlayers.map(p => (p as any)[m.key] as number), 1)
    classAvg[m.key] = classPlayers.reduce((s, p) => s + ((p as any)[m.key] as number), 0) / classPlayers.length
  })
  const indicator = RADAR_METRICS.map(m => ({ name: m.label, max: maxVals[m.key]! * 1.2 }))

  const series: any[] = [
    {
      name: '职业平均', type: 'radar',
      data: [{ value: RADAR_METRICS.map(m => classAvg[m.key]), name: '职业平均' }],
      lineStyle: { color: '#bbb', width: 1, type: 'dashed' },
      areaStyle: { opacity: 0 }, itemStyle: { color: '#bbb' },
      symbol: 'none', silent: true,
    },
    ...showPlayers.map((p, i) => ({
      name: p.name, type: 'radar',
      data: [{ value: RADAR_METRICS.map(m => (p as any)[m.key] as number), name: p.name }],
      lineStyle: { color: PLAYER_COLORS[i % PLAYER_COLORS.length], width: 2 },
      areaStyle: { color: PLAYER_COLORS[i % PLAYER_COLORS.length] + '33' },
      itemStyle: { color: PLAYER_COLORS[i % PLAYER_COLORS.length] },
      symbol: 'circle', symbolSize: 4,
    })),
  ]

  radarChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: function (params: any) {
        if (!params.value || params.seriesIndex === undefined) return ''
        const idx = RADAR_METRICS.findIndex(m => m.label === params.name)
        if (idx === -1) return '<strong>' + params.seriesName + '</strong>'
        const m = RADAR_METRICS[idx]!
        const val = params.value, avg = classAvg[m.key]!
        const diff = val - avg
        const pct = avg > 0 ? ((diff) / avg * 100).toFixed(1) : '0'
        const sign = diff >= 0 ? '+' : ''
        return '<strong>' + params.seriesName + '</strong><br/>'
          + m.label + ': <strong>' + fmtNum(val) + '</strong> (' + sign + pct + '% vs 平均)<br/>'
          + '职业平均: ' + fmtNum(avg)
      },
    },
    legend: {
      type: 'scroll', bottom: 0,
      itemGap: 14,
      textStyle: { fontSize: 12, color: '#888' },
      pageIconColor: '#999', pageIconInactiveColor: '#ddd',
      pageTextStyle: { color: '#888', fontSize: 12 },
      data: [
        { name: '职业平均', textStyle: { color: '#bbb' } },
        ...showPlayers.map((p, i) => ({
          name: p.name,
          textStyle: { color: PLAYER_COLORS[i % PLAYER_COLORS.length] },
        })),
      ],
    },
    radar: {
      indicator, shape: 'polygon', radius: '62%', center: ['50%', '52%'],
      splitNumber: 4, axisName: { color: '#888', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(0,0,0,0.06)' } },
      splitArea: { areaStyle: { color: ['rgba(0,0,0,0.01)', 'rgba(0,0,0,0.02)'] } },
      axisLine: { lineStyle: { color: 'rgba(0,0,0,0.1)' } },
    },
    series,
  })

  renderPlayerTags()
}

function renderPlayerTags() {
  const container = document.getElementById('playerTags')
  if (!container) return
  container.innerHTML = ''
  classPlayers.forEach(p => {
    const tag = document.createElement('span')
    const clsColor = CLASS_COLORS[p.class] || '#999'
    const isOn = selectedPlayers.has(p.name)
    tag.className = 'player-tag' + (isOn ? ' on' : '')
    tag.textContent = p.name
    tag.title = p.class
    // 统一用 color 设置边框色，用 CSS 变量传递背景色
    tag.style.color = clsColor
    tag.style.borderColor = clsColor
    if (isOn) {
      tag.style.setProperty('--tag-bg', clsColor)
    }
    tag.onclick = () => {
      if (selectedPlayers.has(p.name)) {
        if (selectedPlayers.size <= 1) return
        selectedPlayers.delete(p.name)
      } else {
        selectedPlayers.add(p.name)
      }
      renderRadar()
      renderBar()
    }
    container.appendChild(tag)
  })
}

function renderBar() {
  const container = document.getElementById('barChart')
  const allPlayers = (rawData.value?.[currentMatch.value] || []).map(normalizePlayer)
  if (!container || allPlayers.length === 0) return

  if (barChart) barChart.dispose()
  barChart = echarts.init(container)

  barChart.on('click', function (params: any) {
    if (!params.name) return
    if (classPlayers.some(p => p.name === params.name)) {
      if (selectedPlayers.has(params.name)) {
        if (selectedPlayers.size > 1) selectedPlayers.delete(params.name)
      } else {
        selectedPlayers.add(params.name)
      }
      renderRadar()
      renderBar()
    }
  })

  const met = BAR_METRICS.find(m => m.key === barMetric.value) || BAR_METRICS[0]
  const sorted = [...allPlayers].sort((a, b) => (b as any)[barMetric.value] - (a as any)[barMetric.value])

  barChart.setOption({
    tooltip: {
      trigger: 'axis', axisPointer: { type: 'shadow' },
      formatter: function (ps: any[]) {
        const v = ps[0]
        const p = allPlayers.find(pp => pp.name === v.name)
        const isSel = selectedPlayers.has(v.name)
        const valStr = (barMetric.value === 'totalKills' && p)
          ? p.kills + '/' + p.spring
          : fmtNum(v.value)
        return '<strong>' + v.name + '</strong> (' + (p?.class || '') + ')<br/>'
          + met!.label + ': <strong>' + valStr + '</strong>'
          + (isSel ? '<br/><span style="color:#999">✅ 雷达图中</span>' : '')
      },
    },
    grid: { left: 12, right: 40, top: 20, bottom: 130, containLabel: true },
    xAxis: {
      type: 'category', data: sorted.map(p => p.name),
      axisLabel: { color: '#888', fontSize: 9, rotate: 30, interval: 0 },
      axisLine: { lineStyle: { color: '#ddd' } }, axisTick: { show: false },
    },
    yAxis: {
      type: 'value', name: met!.label,
      nameTextStyle: { color: '#888', fontSize: 11 },
      axisLabel: { color: '#aaa', fontSize: 10, formatter: fmtNum },
      splitLine: { lineStyle: { color: '#eee', type: 'dashed' } }, axisLine: { show: false },
    },
    series: [{
      type: 'bar',
      data: sorted.map(p => ({
        value: (p as any)[barMetric.value] as number,
        itemStyle: {
          color: CLASS_COLORS[p.class] || '#999',
          borderRadius: [3, 3, 0, 0],
          opacity: selectedPlayers.has(p.name) ? 1 : 0.6,
        },
      })),
      barMaxWidth: 36,
    }],
  })
}

// ==================== 生命周期 ====================
onMounted(() => window.addEventListener('resize', onResize))
onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  radarChart?.dispose()
  barChart?.dispose()
})
function onResize() {
  radarChart?.resize()
  barChart?.resize()
}
</script>

<style scoped>
.dataviz { max-width: 1280px; margin: 0 auto; padding: 32px 24px 60px; }

/* 页头 */
.dv-header { margin-bottom: 28px; text-align: center; }
.dv-header h1 { font-size: 24px; font-weight: 700; }
.dv-header p { color: var(--color-text-muted); font-size: 14px; margin-top: 6px; }

/* 上传区 */
.upload-zone {
  position: relative; margin-bottom: 28px;
  border: 2px dashed var(--color-border); border-radius: var(--radius-lg);
  padding: 48px 24px; text-align: center; cursor: pointer;
  transition: all var(--transition-smooth); background: var(--color-surface);
}
.upload-zone:hover,
.upload-zone.dragover {
  border-color: var(--color-accent);
  background: rgba(139,94,60,0.03);
  transform: scale(1.01);
}
.uz-icon { font-size: 48px; margin-bottom: 12px; filter: grayscale(1); }
.uz-text { font-size: 16px; color: var(--color-text-muted); }
.uz-hint { font-size: 13px; color: #bbb; margin-top: 8px; }
.file-info { margin-top: 16px; color: #555; font-size: 14px; }

/* ===== 两边阵营概况对比 ===== */
.vs-summary { display: flex; gap: 24px; margin-bottom: 28px; }
.vs-column { flex: 1; }
.vs-title {
  font-size: 18px; font-weight: 700; text-align: center;
  margin-bottom: 14px; color: var(--color-text);
}
.vs-cards { display: flex; gap: 10px; flex-wrap: wrap; }
.vs-card {
  flex: 1; min-width: 80px; text-align: center;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 14px 12px;
  transition: all var(--transition-fast);
}
.vs-card:hover { box-shadow: var(--shadow-hover); }
.vs-card.clickable {
  cursor: pointer; border-color: var(--color-accent-light);
  transition: all var(--transition-fast);
}
.vs-card.clickable:hover {
  background: rgba(139,94,60,0.04);
  transform: translateY(-2px);
  border-color: var(--color-accent);
}
.vs-num { font-size: 22px; font-weight: 700; color: var(--color-accent); }
.vs-lbl { font-size: 12px; color: var(--color-text-muted); margin-top: 4px; }

/* 控制栏 */
.controls {
  display: flex; gap: 10px; flex-wrap: wrap; align-items: center;
  margin-bottom: 24px; padding: 14px 20px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}
.controls label { font-size: 13px; color: var(--color-text-muted); white-space: nowrap; }
.controls select {
  padding: 6px 12px; border: 1px solid var(--color-border);
  border-radius: var(--radius-sm); font-size: 13px; font-family: inherit;
  background: var(--color-bg); color: var(--color-text); cursor: pointer;
  max-width: 160px;
}
.tab-btn {
  padding: 6px 16px; border: 1px solid var(--color-border);
  background: var(--color-bg); color: var(--color-text-muted);
  border-radius: var(--radius-sm); font-size: 13px;
  transition: all var(--transition-fast);
}
.tab-btn:hover { border-color: var(--color-accent); color: var(--color-accent); }
.tab-btn.active { background: var(--color-accent); color: #fff; border-color: var(--color-accent); }

/* 图表区 */
.charts-area { display: flex; flex-direction: column; gap: 24px; }
.chart-section h2 { font-size: 17px; margin-bottom: 4px; }
.chart-section .subtitle { font-size: 13px; color: var(--color-text-muted); margin-bottom: 16px; }
.chart-box { width: 100%; height: 440px; }
.chart-box.tall { height: 540px; }
.no-data-hint {
  text-align: center; color: #bbb; padding: 40px 0; font-size: 14px;
}


/* 指标按钮 */
.metric-bar { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 16px; }
.metric-btn {
  padding: 5px 12px; border: 1px solid var(--color-border);
  background: var(--color-bg); color: var(--color-text-muted);
  border-radius: 6px; font-size: 12px;
  transition: all var(--transition-fast);
}
.metric-btn:hover { border-color: var(--color-accent); color: var(--color-accent); }
.metric-btn.active { background: var(--color-accent); color: #fff; border-color: var(--color-accent); }

/* 职业图例 */
.class-legend {
  display: flex; flex-wrap: wrap; gap: 16px; justify-content: center;
  padding: 14px 0 0; border-top: 1px solid var(--color-border); margin-top: 12px;
}
.legend-item { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: #888; }
.legend-dot { display: inline-block; width: 12px; height: 12px; border-radius: 3px; }

/* 空状态 */
.empty-state { text-align: center; padding: 80px 20px; color: #bbb; }
.empty-state .icon { font-size: 64px; margin-bottom: 16px; filter: grayscale(1); }
.empty-state p { font-size: 16px; }

/* ===== 职业分布弹窗 ===== */
.modal-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(0,0,0,0.32); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  animation: fadeIn 0.2s ease both;
}
.modal-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 28px 32px 24px;
  min-width: 420px; max-width: 560px; max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
  animation: scaleIn 0.25s ease both;
}
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.modal-header h3 { font-size: 18px; }
.modal-close {
  width: 32px; height: 32px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; color: #999; transition: all var(--transition-fast);
}
.modal-close:hover { background: #f0f0f0; color: #333; }

.class-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.class-table th,
.class-table td { padding: 8px 14px; text-align: center; border-bottom: 1px solid var(--color-border); }
.class-table th { font-size: 13px; color: var(--color-text-muted); font-weight: 600; }
.class-table td { color: var(--color-text); }
.class-table .total-row td { border-bottom: none; padding-top: 14px; }
.class-dot { display: inline-block; width: 10px; height: 10px; border-radius: 3px; margin-right: 6px; vertical-align: middle; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes scaleIn { from { opacity: 0; transform: scale(0.94); } to { opacity: 1; transform: scale(1); } }

@media (max-width: 768px) {
  .dataviz { padding: 20px 12px 40px; }
  .vs-summary { flex-direction: column; gap: 16px; }
  .chart-box { height: 340px; }
  .chart-box.tall { height: 400px; }
  .modal-card { min-width: auto; margin: 0 16px; padding: 20px 18px; }
}
</style>

<!-- 非 scoped：document.createElement 创建的元素不会被 scoped CSS 命中 -->
<style>
#playerTags {
  display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px;
  justify-content: center; padding: 4px 0;
}
.player-tag {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 6px 16px; border-radius: 100px;
  font-size: 13px; font-weight: 500; cursor: pointer; user-select: none;
  border: 1.5px solid;
  background: #fafafa;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.player-tag::before {
  content: ''; display: inline-block;
  width: 7px; height: 7px; border-radius: 50%;
  background: currentColor; flex-shrink: 0;
}
.player-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 12px rgba(0,0,0,0.1);
}
.player-tag.on {
  color: #fff !important;
  background: var(--tag-bg, #999);
  border-color: var(--tag-bg, #999);
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  transform: translateY(-1px);
}
.player-tag.on::before { background: rgba(255,255,255,0.7); }
</style>
