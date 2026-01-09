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

export function getCurrentDatetime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}:${seconds}`,
    datetime: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
    iso: now.toISOString(),
    jsDate: now,
    month,
    year,
  };
}

export function getDateMinusDays(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

export function getDateAddDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

export function addDays(dateStr, days = 1) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function generateThaiMonths() {
  const monthNames = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
    'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
    'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  return monthNames.map((name, index) => ({
    id: index + 1,
    name
  }));
}

export function isNowAfter(timeStr) {
  const now = getCurrentDatetime().jsDate;
  const target = getCurrentDatetime().jsDate;
  const [h, m] = timeStr.split(':').map(Number);
  target.setHours(h, m, 0, 0);
  return now.getTime() > target.getTime();
}

export function isNowAfterDateTime(dateStr, timeStr) {
  const now = getCurrentDatetime().jsDate;
  const [year, month, day] = dateStr.split('-').map(Number);
  const [h, m] = timeStr.split(':').map(Number);
  const target = new Date(year, month - 1, day, h, m, 0, 0);
  return now.getTime() > target.getTime();
}

export function isWithinDuration(targetTime, durationHours) {
  const target = targetTime instanceof Date ? targetTime : new Date(targetTime);
  const now = new Date();
  const diffMs = target - now;
  const diffHours = diffMs / (1000 * 60 * 60);
  return diffHours <= durationHours;
}


export function subtractLeaveFromWork(workStart, workEnd, leaveStart, leaveEnd) {
  const toMinutes = (t) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  const workStartMin = toMinutes(workStart);
  const workEndMin = toMinutes(workEnd);
  const leaveStartMin = toMinutes(leaveStart);
  const leaveEndMin = toMinutes(leaveEnd);
  // leave morning
  if (leaveStartMin <= workStartMin && leaveEndMin < workEndMin) {
    return { start: leaveEnd, end: workEnd };
  }
  // leave afternoon
  if (leaveStartMin > workStartMin && leaveEndMin >= workEndMin) {
    return { start: workStart, end: leaveStart };
  }
  return { start: workStart, end: workEnd };
}

export function toMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}
