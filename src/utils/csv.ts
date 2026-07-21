/**
 * CSV 解析工具 —— 逆水寒约战数据专用
 *
 * CSV 格式说明：
 *   首行："对局名称","玩家数量"
 *   次行：字段头（玩家名字,职业,击败/清泉,…）
 *   后续 N 行：玩家数据
 *   多局对局数据依次拼接
 */

// --- 类型定义 ---

/** CSV 原始行：字段名 → 原始字符串 */
export interface RawPlayer extends Record<string, string> {}

/** 归一化后的玩家数据：所有数值字段转为 number */
export interface NormalizedPlayer {
  name: string
  class: string
  kills: number          // 击败（击败/清泉 的分子）
  spring: number         // 清泉（击败/清泉 的分母）
  totalKills: number     // 击败总数 = kills + spring
  assists: number        // 助攻
  resource: number       // 资源
  playerDmg: number      // 对玩家伤害
  playerDmgArmor: number // 人伤卸甲
  buildingDmg: number    // 对建筑伤害
  buildingDmgArmor: number // 破塔卸甲
  healing: number        // 治疗值
  takenDmg: number       // 承受伤害
  deaths: number         // 重伤
  revives: number        // 复活/清泉
  boneBurn: number       // 焚骨
}

/** 对局名 → 原始玩家记录 */
export type MatchRawData = Record<string, RawPlayer[]>

/** 职业名 → 归一化玩家列表 */
export type ClassGroups = Record<string, NormalizedPlayer[]>

// --- 解析一行 CSV（处理引号内逗号） ---
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = '', quoted = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]!
    if (c === '"') {
      if (quoted && line[i + 1] === '"') { current += '"'; i++ }
      else quoted = !quoted
    } else if (c === ',' && !quoted) {
      result.push(current); current = ''
    } else {
      current += c
    }
  }
  result.push(current)
  return result
}

// --- 解析完整 CSV 文本 ---
export function parseCSV(text: string): MatchRawData {
  const lines = text.split(/\r?\n/).filter(l => l.trim() !== '')
  const result: MatchRawData = {}
  let i = 0

  while (i < lines.length) {
    // 匹配对局头："对局名","人数"
    const headerMatch = lines[i]!.match(/^"(.+?)","(\d+)"$/)
    if (!headerMatch) { i++; continue }

    const matchName = headerMatch[1]!
    const playerCount = parseInt(headerMatch[2]!)
    i++

    if (i >= lines.length) break

    // 字段头行
    const headers = parseCSVLine(lines[i]!)
    i++

    // 玩家数据行
    const players: RawPlayer[] = []
    for (let j = 0; j < playerCount && i < lines.length; j++, i++) {
      const values = parseCSVLine(lines[i]!)
      if (values.length < headers.length) continue // 跳过残缺行
      const player: RawPlayer = {}
      headers.forEach((h, idx) => { player[h] = (values[idx] || '').trim() })
      players.push(player)
    }

    if (players.length > 0) result[matchName] = players
  }

  return result
}

// --- 归一化：字符串 → 数值 ---
export function normalizePlayer(p: RawPlayer): NormalizedPlayer {
  const kd = (p['击败/清泉'] || '0/0').split('/')
  const killsVal = parseFloat(kd[0]!) || 0
  const springVal = parseFloat(kd[1]!) || 0
  const rv = (p['复活/清泉'] || '0').toString()

  return {
    name: p['玩家名字'] || '',
    class: p['职业'] || '',
    kills: killsVal,
    spring: springVal,
    totalKills: killsVal + springVal,  // 击败总数 = 击败 + 清泉
    assists: parseFloat(p['助攻']) || 0,
    resource: parseFloat(p['资源']) || 0,
    playerDmg: parseFloat(p['对玩家伤害']) || 0,
    playerDmgArmor: parseFloat(p['人伤卸甲']) || 0,
    buildingDmg: parseFloat(p['对建筑伤害']) || 0,
    buildingDmgArmor: parseFloat(p['破塔卸甲']) || 0,
    healing: parseFloat(p['治疗值']) || 0,
    takenDmg: parseFloat(p['承受伤害']) || 0,
    deaths: parseFloat(p['重伤']) || 0,
    revives: parseFloat(rv) || 0,
    boneBurn: parseFloat(p['焚骨']) || 0,
  }
}

// --- 按职业分组 ---
export function groupByClass(players: RawPlayer[]): ClassGroups {
  const groups: ClassGroups = {}
  players.forEach(raw => {
    const p = normalizePlayer(raw)
    const cls = p.class || '未知'
    if (!groups[cls]) groups[cls] = []
    groups[cls].push(p)
  })
  return groups
}
