import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, ScrollView } from 'react-native';
import { Text, Appbar, Card, DataTable, Button, Menu } from 'react-native-paper';
import styles from '../styles/style';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const OT_HISTORY = [
  { id: '1', date: '15 ก.ย. 2025', shift: 'เช้า', start: '08:00', end: '16:00', status: 'อนุมัติแล้ว' , amount: '2' },
  { id: '2', date: '14 ก.ย. 2025', shift: 'บ่าย', start: '16:00', end: '00:00', status: 'รออนุมัติ' , amount: '1'},
  { id: '3', date: '13 ก.ย. 2025', shift: 'เช้า', start: '08:00', end: '16:00', status: 'อนุมัติแล้ว' , amount: '1'},
  { id: '4', date: '12 ก.ย. 2025', shift: 'บ่าย', start: '16:00', end: '00:00', status: 'อนุมัติแล้ว', amount: '1' },
  { id: '5', date: '11 ก.ย. 2025', shift: 'เช้า', start: '08:00', end: '16:00', status: 'รออนุมัติ', amount: '1' },
  { id: '6', date: '10 ก.ย. 2025', shift: 'บ่าย', start: '16:00', end: '00:00', status: 'อนุมัติแล้ว' , amount: '1'},
  { id: '7', date: '9 ก.ย. 2025', shift: 'เช้า', start: '08:00', end: '16:00', status: 'อนุมัติแล้ว', amount: '1' },
  { id: '8', date: '8 ก.ย. 2025', shift: 'บ่าย', start: '16:00', end: '00:00', status: 'รออนุมัติ', amount: '1' },
  { id: '9', date: '7 ก.ย. 2025', shift: 'เช้า', start: '08:00', end: '16:00', status: 'อนุมัติแล้ว' , amount: '2'},
  { id: '10', date: '6 ก.ย. 2025', shift: 'บ่าย', start: '16:00', end: '00:00', status: 'อนุมัติแล้ว', amount: '2' },
];

export default function OverTime({ navigation }) {
  
  const renderItem = ({ item }) => (
    <Card style={{ marginBottom: 12, borderRadius: 12, padding: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <MaterialCommunityIcons
          name="clock-outline"
          size={28}
          color="#ff3b30"
          style={{ marginRight: 12 }}
        />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.date}</Text>
            <Text style={{ fontSize: 16}}>OT <Text style={{color:'red' , fontWeight: 'bold'}}>{item.amount}</Text> ชม</Text>
          </View>
          <Text style={{ fontSize: 14, color: '#555' }}>
            กะ: {item.shift} | เวลา: {item.start} - {item.end}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: item.status === 'อนุมัติแล้ว' ? '#4caf50' : '#ff9800',
            }}
          >
            สถานะ: {item.status}
          </Text> 
        </View>
      </View>
    </Card>
  );
  
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Action icon="arrow-left" color="#ff3b30"    onPress={() => navigation.goBack()} />
        <Appbar.Content title="OT" titleStyle={{ textAlign: 'center', color: "white" }} />
        <Appbar.Action icon="bell" color="#ff3b30" onPress={() => console.log("กดแจ้งเตือน")} />
      </Appbar.Header>
 

      {/* รายการ OT */}
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        data={OT_HISTORY}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
 
   
      
      {/* ปุ่มสร้างการลา */}
      <View style={styles.bottomBar}>
        <Button
          mode="contained"
          icon="clock-plus-outline"
          onPress={() => navigation.navigate('OTRequest')}
          style={styles.addButton}
          labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
        >
          ขอ OT
        </Button>
      </View>
      
    </View>
  );
}
