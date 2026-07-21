/**
 * 通用校验工具
 */

/** 检查是否为空字符串 */
export function isEmpty(v: string): boolean {
  return v.trim().length === 0
}

/** 检查是否为有效数字 */
export function isNumeric(v: string): boolean {
  return !isNaN(parseFloat(v)) && isFinite(Number(v))
}

/** 校验 CSV 文件名（至少以 .csv 结尾） */
export function isCSVFile(name: string): boolean {
  return /\.csv$/i.test(name)
}
