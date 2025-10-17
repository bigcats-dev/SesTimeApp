import React, { useState, useEffect } from 'react';
import { Calendar } from 'react-native-calendars';
import { generateWorkDays } from '../mocks/agendaItem';

async function fetchWorkDays(year, month) {
  // mockup API
  const data = {
    workDays: generateWorkDays(year, month),
    leaveDays: ["2025-10-15"],
    holidays: []
  };
  return data;
}

export default function WorkCalendar({ onDayPress, startDate, endDate }) {
  const [markedDates, setMarkedDates] = useState({});

  const generateMarkedDates = async (year, month) => {
    try {
      const { workDays, leaveDays, holidays } = await fetchWorkDays(year, month);
      const daysInMonth = new Date(year, month, 0).getDate();
      const newMarkedDates = {};

      for (let d = 1; d <= daysInMonth; d++) {
        const dayStr = `${year}-${month.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
        const isWorkDay = workDays.some(d => d.title == dayStr);
        const isLeaveDay = leaveDays.includes(dayStr);
        const isHoliday = holidays.includes(dayStr);
        const todayStr = new Date().toISOString().split('T')[0];
        const isPast = dayStr < todayStr;
        const disabled = !isWorkDay || isPast || isLeaveDay;
        newMarkedDates[dayStr] = {
          marked: isWorkDay,
          dotColor: isLeaveDay ? 'red' : 'blue',
          disabled,
        };
      }

      if (startDate) {
        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : start;
        let current = new Date(start);

        while (current <= end) {
          const d = current.toISOString().split('T')[0];
          if (newMarkedDates[d]) {
            newMarkedDates[d] = {
              ...newMarkedDates[d],
              startingDay: d === startDate,
              endingDay: d === (endDate || startDate),
              color: 'lightblue',
              textColor: 'black'
            };
          }
          current.setDate(current.getDate() + 1);
        }
      }

      setMarkedDates(newMarkedDates);
    } catch (error) {
      console.error("Error fetching work days:", error);
    }
  };

  useEffect(() => {
    const today = new Date();
    generateMarkedDates(today.getFullYear(), today.getMonth() + 1);
  }, [startDate, endDate]);

  return (
    <Calendar
      minDate={new Date().toISOString().split('T')[0]}
      markingType={'period'}
      markedDates={markedDates}
      onMonthChange={(month) => generateMarkedDates(month.year, month.month)}
      disableAllTouchEventsForDisabledDays={true}
      onDayPress={onDayPress}
    />
  );
}
