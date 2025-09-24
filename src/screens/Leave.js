import React from 'react';
import { View, Image, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { Text, Appbar, Card, Button } from 'react-native-paper';
import styles from '../styles/style';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const LEAVE_HISTORY = [
  {
    id: '1',
    type: 'ลาป่วย',
    date: '12 ก.ย. 2025',
    days: '2 วัน',
    reason: 'ป่วยเป็นไข้',
  },
  {
    id: '2',
    type: 'ลากิจ',
    date: '5 ก.ย. 2025',
    days: '1 วัน',
    reason: 'ไปทำธุระที่บ้าน',
  },
  {
    id: '3',
    type: 'ลาพักร้อน',
    date: '20 ส.ค. 2025',
    days: '3 วัน',
    reason: 'ไปเที่ยวกับครอบครัว',
  },
  {
    id: '4',
    type: 'ลาป่วย',
    date: '10 ส.ค. 2025',
    days: '1 วัน',
    reason: 'ปวดหัว ไมเกรน',
  },
];

export default function Leave({ navigation }) {
  const renderItem = ({ item }) => (
    <Card style={styles.leaveCard}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <MaterialCommunityIcons
          name="calendar-check"
          size={28}
          color="#0072ff"
          style={{ marginRight: 12 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.leaveType}>{item.type}</Text>
          <Text style={styles.leaveText}>📅 วันที่ลา: {item.date}</Text>
          <Text style={styles.leaveText}>⏳ จำนวนวันลา: {item.days}</Text>
          <Text style={styles.leaveText}>📝 เหตุผล: {item.reason}</Text>
        </View>
      </View>
    </Card>
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
          title="ประวัติการลา"
          titleStyle={{ textAlign: 'center', color: 'white' }}
        />
        <Appbar.Action
          icon="bell"
          color="#ff3b30"
          onPress={() => console.log('กดแจ้งเตือน')}
        />
      </Appbar.Header>

      {/* Content */}
      <View style={{ flex: 1 }}>
  
        <View style={{ flex: 1, paddingHorizontal: 16, marginTop: 10 }}>
          <Text style={styles.sectionTitle}>รายการประวัติการลา</Text>
          <FlatList
            data={LEAVE_HISTORY}
            keyExtractor={(i) => i.id}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            contentContainerStyle={{ paddingBottom: 80 }} // กันไม่ให้ทับปุ่ม
          />
        </View>
      </View>

      {/* ปุ่มสร้างการลา */}
      <View style={styles.bottomBar}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('LeaveForm')}
          style={styles.addButton}
          labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
        >
          + สร้างการลา
        </Button>
      </View>
    </View>
  );
}
 
