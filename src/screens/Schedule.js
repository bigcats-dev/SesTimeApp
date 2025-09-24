import React, { useRef, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Text, Appbar, Card } from 'react-native-paper';
import styles from '../styles/style';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const screenHeight = Dimensions.get('window').height;

const today = new Date();

// สร้างข้อมูล 30 วัน และหยุดทุกวันอาทิตย์
const WORK_SCHEDULE = [];
for (let i = 1; i <= 30; i++) {
  const dateObj = new Date(today.getFullYear(), today.getMonth(), i);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('th-TH', { month: 'short' });
  const isSunday = dateObj.getDay() === 0; // อาทิตย์เป็นวันหยุด
  WORK_SCHEDULE.push({
    id: i.toString(),
    date: `${day} ${month} 2025`,
    shift: isSunday ? 'DayOff' : i % 2 === 0 ? 'บ่าย' : 'เช้า',
    start: isSunday ? '--' : i % 2 === 0 ? '16:00' : '08:00',
    end: isSunday ? '--' : i % 2 === 0 ? '00:00' : '16:00',
    isDayOff: isSunday,
  });
}

export default function WorkSchedule({ navigation }) {
  const flatListRef = useRef();

  // focus วันที่ปัจจุบัน
  useEffect(() => {
    const todayIndex = today.getDate() - 1;
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({ index: todayIndex, viewPosition: 0.5 });
    }, 100);
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ScheduleDetail', { item })}>
      <Card
        style={{
          marginBottom: 12,
          borderRadius: 12,
          padding: 12,
          backgroundColor: item.isDayOff ? '#ffd6d6' : '#fff',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons
            name={item.isDayOff ? 'calendar-remove' : 'calendar-clock'}
            size={28}
            color={item.isDayOff ? '#ff3b30' : '#0072ff'}
            style={{ marginRight: 12 }}
          />
          <View>
            <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.date}</Text>
            <Text style={{ fontSize: 14, color: item.isDayOff ? '#ff3b30' : '#555' }}>
              {item.isDayOff ? 'วันหยุด' : `กะ: ${item.shift} | เวลา: ${item.start} - ${item.end}`}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Appbar.Header style={styles.appbar}>
        <Appbar.Action
          icon="arrow-left"
          color="#ff3b30"
          onPress={() => navigation.goBack()}
        />
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

      {/* ข้อมูลพนักงาน */}
       

      {/* ตารางเวลา */}
      <FlatList
        ref={flatListRef}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 , marginTop: 20}}
        data={WORK_SCHEDULE}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
