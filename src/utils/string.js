/**
 * ตรวจสอบว่า string ว่างหรือ null หรือ undefined หรือมีแต่ space
 * @param {string} str
 * @returns {boolean} true = ว่าง, false = มีค่า
 */
export function isEmptyString(str) {
    return !str || str.trim().length === 0;
}