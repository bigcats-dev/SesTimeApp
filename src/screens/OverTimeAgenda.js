import { View, Text, KeyboardAvoidingView, ScrollView, Platform, RefreshControl } from 'react-native'
import React, { useEffect, useCallback, useState } from 'react'
import AppHeader from '../components/AppHeader'
import { useLazyGetScheduleQuery } from '../services/schedule'
import { default as AgendaList } from '../components/AgendaList'
import { getCurrentDatetime, isNowAfter } from '../utils'
import { ActivityIndicator } from 'react-native-paper'
import { default as CardSkeleton } from './../components/skeletions/Leave'

const OverTimeAgenda = ({ navigation }) => {
  const [items, setItems] = useState({ items: [], markedDates: [] });
  const [refreshing, setRefreshing] = useState(false);
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
          //   acc.shift.push({ start_time: curr.start_time, end_time: curr.end_time });
          //   return acc;
          // }, {});
          // updatedWorkDays[i] = {
          //   title: updatedWorkDays[i].title,
          //   data: [grouped]
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
    const result = await fetchSchedule({ startDate, endDate }).unwrap();
    generateMarkedDates(result, year, month);
  }, [fetchSchedule]);

  const onAgendaItemPress = (section, item) => {
    if (__DEV__) {
      console.log('section:', section);
      console.log('Pressed item:', item);
    }
    const { title } = section;
    const { end } = item;
    const currentDate = getCurrentDatetime().date;
    if (currentDate <= title) {
      if (currentDate === title && isNowAfter(end)) return;
      navigation.navigate('OverTimeForm', { item, section, from: 'stack' });
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={{ flex: 1 }}>
        <AppHeader title={'ตารางการทำงาน'} />
        {isFetching && [...Array(10)].map((_, i) => <CardSkeleton key={i} />)}
        {Object.keys(items.markedDates).length > 0 && (
          <AgendaList
            items={items.items}
            markedDates={items.markedDates}
            onMonthChange={onMonthChange}
            onAgendaItemPress={onAgendaItemPress}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} />

        )}
      </View>
    </KeyboardAvoidingView>
  )
}

export default OverTimeAgenda