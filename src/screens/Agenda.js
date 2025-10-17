import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { Appbar } from 'react-native-paper';
import AgendaList from '../components/AgendaList';
import styles from '../styles/style';
import { useRoute } from '@react-navigation/native';
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

export default function AgendaScreen({ navigation }) {
  const [items, setItems] = useState({ items: [], markedDates: [] });
  const route = useRoute();
  const from = route.params?.from || 'drawer';

  const generateMarkedDates = async (year, month) => {
    try {
      const { workDays, leaveDays } = await fetchWorkDays(year, month);
      const daysInMonth = new Date(year, month, 0).getDate();
      const newMarkedDates = {};
      for (let d = 1; d <= daysInMonth; d++) {
        const dayStr = `${year}-${month.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
        const isWorkDay = workDays.some(d => d.title == dayStr);
        const isLeaveDay = leaveDays.includes(dayStr);
        newMarkedDates[dayStr] = {
          marked: isWorkDay,
          dotColor: isLeaveDay ? 'red' : 'blue',
        };
        if (isLeaveDay) {
          const i = workDays.findIndex(d => d.title == dayStr);
          workDays[i] = { title: workDays[i].title, data: [{ isLeaveDay }] }
        }
      }
      setItems({ items: workDays, markedDates: newMarkedDates })
    } catch (error) {
      console.error("Error fetching work days:", error);
    }
  }
  useEffect(() => {
    const today = new Date();
    generateMarkedDates(today.getFullYear(), today.getMonth() + 1);
  }, []);

  const onMonthChange = useCallback(({ dateString }) => {
    console.log('ExpandableCalendarScreen onMonthChange: ', dateString);
    const [year, month] = dateString.split('-').map(Number);
    generateMarkedDates(year, month);
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Appbar.Header style={styles.appbar}>
        {from === 'drawer' ? (
          <Appbar.Action
            icon="menu"
            color="#ff3b30"
            onPress={() => navigation.openDrawer()}
          />
        ) : (
          <Appbar.Action
            icon="arrow-left"
            color="#ff3b30"
            onPress={() => navigation.goBack()}
          />
        )}
        <Appbar.Content
          title="ตารางการทำงาน"
          titleStyle={{ textAlign: 'center', color: 'white' }}
        />
        <Appbar.Action
          icon="bell"
          color="#ff3b30"
          onPress={() => console.log('กดแจ้งเตือน')}
        />
      </Appbar.Header>
      <AgendaList
        items={items.items}
        markedDates={items.markedDates}
        onMonthChange={onMonthChange} />
    </View>
  );
}