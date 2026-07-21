/**
 * 数字格式化工具
 * 用于图表数值的友好展示
 */

/** 格式化大数字：过万用 "w"，过亿用 "亿" */
export function fmtNum(v: number): string {
  if (v >= 1e8) return (v / 1e8).toFixed(1) + '亿'
  if (v >= 1e4) return (v / 1e4).toFixed(1) + 'w'
  if (v >= 1e3) return (v / 1e3).toFixed(1) + 'k'
  return Math.round(v).toLocaleString()
}

/** 格式化百分比，保留一位小数 */
export function fmtPercent(v: number, total: number): string {
  if (total === 0) return '0%'
  return ((v / total) * 100).toFixed(1) + '%'
}

/** 转义 HTML 特殊字符，防 XSS */
export function escHtml(s: string): string {
  const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }
  return s.replace(/[&<>"]/g, c => map[c] || c)
}
