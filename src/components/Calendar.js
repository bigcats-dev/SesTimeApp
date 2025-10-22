import React, { useState, useEffect, useCallback } from 'react';
import { Calendar } from 'react-native-calendars';
import { generateWorkDays } from '../mocks/agendaItem';
import { Image } from 'react-native';
import { useLazyGetScheduleQuery } from '../services/schedule';

export default function WorkCalendar({ onDayPress, startDate, endDate , minDate}) {
  const [markedDates, setMarkedDates] = useState({});
  const [fetchSchedule, { isFetching }] = useLazyGetScheduleQuery()

  const generateMarkedDates = async (result, year, month) => {
    try {
      const leaveDays = [];
      const holidays = [];
      const workDays = result.map(day => ({ ...day }));
      const daysInMonth = new Date(year, month, 0).getDate();
      const newMarkedDates = {};

      for (let d = 1; d <= daysInMonth; d++) {
        const dayStr = `${year}-${month.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
        const isWorkDay = workDays.some(d => d.title == dayStr);
        const isLeaveDay = workDays.some(d => d.title == dayStr && d.is_leave === true);
        const isHoliday = holidays.includes(dayStr);
        const isPast = dayStr < minDate;
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
          const isStart = d === startDate;
          const isEnd = d === (endDate || startDate);

          newMarkedDates[d] = {
            ...(newMarkedDates[d] || {}),
            startingDay: isStart,
            endingDay: isEnd,
            color: '#ff7f50',
            textColor: '#fff'
          };

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
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const loadData = async () => {
      try {
        const result = await fetchSchedule().unwrap();
        generateMarkedDates(result, year, month);
      } catch (error) {
        console.error('error', error);
      }
    };
    loadData();
  }, [startDate, endDate, minDate]);

  const onMonthChange = useCallback(async (value) => {
    const [year, month] = [value.year, value.month]
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = `${year}-${month.toString().padStart(2, '0')}-${new Date(year, month, 0).getDate()}`;
    const result = await fetchSchedule({ startDate, endDate }).unwrap();
    generateMarkedDates(result, year, month);
  }, [fetchSchedule]);

  return (
    <Calendar
      minDate={minDate}
      markingType={'period'}
      markedDates={markedDates}
      onMonthChange={onMonthChange}
      disableAllTouchEventsForDisabledDays={true}
      onDayPress={onDayPress}
      renderArrow={(direction) => (
        <Image
          source={
            direction === 'left'
              ? require('../img/previous.png')
              : require('../img/next.png')
          }
          style={{ tintColor: '#ff7f50' }}
        />
      )}
      theme={{
        todayTextColor: '#ff7f50',
        selectedDayBackgroundColor: '#ff7f50',
        selectedDayTextColor: '#fff',
        monthTextColor: '#333',
        textDayFontWeight: '500',
        arrowColor: '#ff7f50',
        backgroundColor: '#fff'
      }}
    />
  );
}
