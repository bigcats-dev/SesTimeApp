import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { Appbar } from 'react-native-paper';
import AgendaList from '../components/AgendaList';
import styles from '../styles/style';
import { useRoute } from '@react-navigation/native';
import { useLazyGetScheduleQuery } from '../services/schedule';
import AppHeader from '../components/AppHeader';

export default function AgendaScreen({ navigation }) {
  const [items, setItems] = useState({ items: [], markedDates: [] });
  const route = useRoute();
  const from = route.params?.from || 'drawer';
  const [fetchSchedule, { isFetching }] = useLazyGetScheduleQuery()

  const generateMarkedDates = async (workDaysData, year, month) => {
    try {
      const daysInMonth = new Date(year, month, 0).getDate();
      const newMarkedDates = {};
      const updatedWorkDays = workDaysData.map(day => ({ ...day }));
      for (let d = 1; d <= daysInMonth; d++) {
        const dayStr = `${year}-${month.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
        const isWorkDay = workDaysData.some(d => d.title == dayStr);
        const isLeaveDay = workDaysData.some(d => d.title == dayStr && d.is_leave === true);
        newMarkedDates[dayStr] = {
          marked: isWorkDay,
          dotColor: isLeaveDay ? 'red' : 'blue',
        };
        if (isLeaveDay) {
          const i = updatedWorkDays.findIndex(d => d.title == dayStr);
          const grouped = updatedWorkDays[i]?.leave_detail?.reduce((acc, curr) => {
            if (!acc.date) {
              acc.date = curr.date;
              acc.leave_type = curr.leave_type;
              acc.reason = curr.reason;
              acc.shift = [];
              acc.isLeaveDay = isLeaveDay;
            }
            acc.shift.push({ start_time: curr.start_time, end_time: curr.end_time });
            return acc;
          }, {});
          updatedWorkDays[i] = {
            title: updatedWorkDays[i].title,
            data: [grouped]
          }
        }
      }
      setItems({ items: updatedWorkDays, markedDates: newMarkedDates })
    } catch (error) {
      console.error("Error fetching work days:", error);
    }
  }
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
  }, []);

  const onMonthChange = useCallback(async ({ dateString }) => {
    const [year, month] = dateString.split('-').map(Number);
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = `${year}-${month.toString().padStart(2, '0')}-${new Date(year, month, 0).getDate()}`;
    const result = await fetchSchedule({ startDate, endDate }).unwrap();
    generateMarkedDates(result, year, month);
  }, [fetchSchedule]);
  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <AppHeader title="ตารางการทำงาน" />
      <AgendaList
        items={items.items}
        markedDates={items.markedDates}
        onMonthChange={onMonthChange} />
    </View>
  );
}