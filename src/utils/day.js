/**
 * generateDaysInMonth - สร้างวันในเดือน ไม่รวมเสาร์-อาทิตย์
 * @param {number} year - ปี เช่น 2025
 * @param {number} month - เดือน (1-12)
 * @returns {string[]} array ของ 'YYYY-MM-DD' ที่ไม่ใช่เสาร์อาทิตย์
 */
export function generateWorkDays(year, month) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const workDays = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d);
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const dateStr = `${year}-${month.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
      workDays.push(dateStr);
    }
  }

  return workDays;
}

export function toDateThai(date) {
  const months = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
  ];

  const d = new Date(date);
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear() + 543;
  return `${day} ${month} ${year.toString().slice(-2)}`;
}

