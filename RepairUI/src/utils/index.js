/**
 * 获取指定范围随机数
 * @param {*} min 
 * @param {*} max 
 * @returns 
 */
export function Random(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}
