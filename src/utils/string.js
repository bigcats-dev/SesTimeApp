/**
 * ตรวจสอบว่า string ว่างหรือ null หรือ undefined หรือมีแต่ space
 * @param {string} str
 * @returns {boolean} true = ว่าง, false = มีค่า
 */
export function isEmptyString(str) {
  if (str === null || str === undefined) return true;
  return String(str).trim().length === 0;
}