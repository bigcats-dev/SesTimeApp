import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { ActivityIndicator, Appbar } from 'react-native-paper';
import AgendaList from '../components/AgendaList';
import styles from '../styles/style';
import { useRoute } from '@react-navigation/native';
import { useLazyGetScheduleQuery } from '../services/schedule';
import AppHeader from '../components/AppHeader';
import { default as LeaveCardSkeleton } from './../components/skeletions/Leave'
import { getCurrentDatetime, getDateMinusDays } from '../utils';

export default function AgendaScreen({ navigation }) {
  const [items, setItems] = useState({ items: [], markedDates: {} });
  const [refreshing, setRefreshing] = useState(false);
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
          const leaves = [...updatedWorkDays[i].leave_detail];
          const mergedData = updatedWorkDays[i].data.map(item => {
            const leave = leaves?.find(l => l.time_work_id === item.id);
            if (leave) {
              return {
                ...item,
                isLeaveDay: true,
                leave: leave
              };
            }
            return item;
          })
          updatedWorkDays[i] = {
            title: updatedWorkDays[i].title,
            data: mergedData
          }

          // const grouped = updatedWorkDays[i]?.leave_detail?.reduce((acc, curr) => {
          //   if (!acc.date) {
          //     acc.date = curr.date;
          //     acc.leave_type = curr.leave_type;
          //     acc.reason = curr.reason;
          //     acc.shift = [];
          //     acc.isLeaveDay = isLeaveDay;
          //   }
          //   acc.shift.push({ start_time: curr.start_time, end_time: curr.end_time, time_work_id: curr.time_work_id });
          //   return acc;
          // }, {});

          // const leaves = updatedWorkDays[i].leave_detail;
          // const noLeaveData = updatedWorkDays[i].data.filter(
          //   item => !leaves.some(l => l.time_work_id === item.id)
          // );
          // if (noLeaveData.length == 0) {
          //   updatedWorkDays[i] = {
          //     title: updatedWorkDays[i].title,
          //     data: [grouped]
          //   }
          // } else {
          //   updatedWorkDays[i] = {
          //     ...updatedWorkDays[i],
          //     data: [grouped, ...noLeaveData]
          //   };
          // }
        }
      }
      setItems({ items: updatedWorkDays, markedDates: newMarkedDates })
    } catch (error) {
      console.error("Error fetching work days:", error);
    }
  }

  const loadData = async () => {
    setRefreshing(true);
    const {
      year,
      month
    } = getCurrentDatetime()
    try {
      const result = await fetchSchedule().unwrap();
      generateMarkedDates(result, year, month);
    } catch (error) {
      console.error('error', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    await loadData();
  };

  const onMonthChange = useCallback(async ({ dateString }) => {
    const [year, month] = dateString.split('-').map(Number);
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = `${year}-${month.toString().padStart(2, '0')}-${new Date(year, month, 0).getDate()}`;
    if (__DEV__) {
      console.log('startDate', startDate)
      console.log('endDate', endDate)
    }
    const result = await fetchSchedule({ startDate, endDate }).unwrap();
    generateMarkedDates(result, year, month);
  }, [fetchSchedule]);

  const onAgendaItemPress = useCallback((item) => {
    const today = new Date(getCurrentDatetime().date);
    const yesterday = getDateMinusDays(1);
    const itemDate = new Date(item.title);
    if (itemDate.toDateString() === today.toDateString() || itemDate.toDateString() === yesterday.toDateString()) {
      navigation.navigate('CheckInStack', { screen: 'CheckIn', params: { workDay: item, from: from } });
    }
  }, [fetchSchedule, navigation, from]);

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <AppHeader title="ตารางการทำงาน" />
      {isFetching && [...Array(10)].map((_, i) => <LeaveCardSkeleton key={i} />)}
      {Object.keys(items.markedDates).length > 0 && (
        <AgendaList
          items={items.items}
          markedDates={items.markedDates}
          onMonthChange={onMonthChange}
          onAgendaItemPress={onAgendaItemPress}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} />
      )}
    </View>
  );
}