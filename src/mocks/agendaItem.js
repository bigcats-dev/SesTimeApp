export function generateWorkDays(year, month) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const workDays = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d);
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const dateStr = `${year}-${month.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
      workDays.push({
        title: dateStr,
        data: [
          { start: '08:00', end: '17:00', duration: '9h' },
        ],
      });
    }
  }

  return workDays;
}

export function generateWorkByStartEndDate(start, end) {
  if (!end) end = start
  const startDate = new Date(start);
  const endDate = new Date(end);
  const workDays = [];
  const shifts = [
    { start: '08:00', end: '17:00', duration: '9h' },
    { start: '13:00', end: '20:00', duration: '7h' },
    { start: '20:00', end: '08:00', duration: '12h' },
  ];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const day = currentDate.getDate();
      const shiftList =
        day % 3 === 0
          ? [shifts[2]]
          : (day % 2 === 0 ? [shifts[0]] : [shifts[0], shifts[1]]);

      workDays.push({
        title: dateStr,
        data: shiftList.map((s, i) => ({
          id: `${dateStr}-${i}`,
          start: s.start,
          end: s.end,
          duration: s.duration,
          originalStart: s.start,
          originalEnd: s.end,
          overnight: s.start === '20:00'
        })),
      });
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return workDays;
}
