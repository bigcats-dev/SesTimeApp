import React, { useState, useRef, useEffect } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { Text, Appbar, Card, DataTable, Button, Menu } from 'react-native-paper';
import styles from '../styles/style';

export default function HistoryDetail({ navigation }) {
  
  const summary = { late: 1, sick: 1, leave: 1 };
   
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Action icon="arrow-left" color="#ff3b30"    onPress={() => navigation.goBack()} />
        <Appbar.Content title="รายละเอียด" titleStyle={{ textAlign: 'center', color: "white" }} />
        <Appbar.Action icon="bell" color="#ff3b30" onPress={() => console.log("กดแจ้งเตือน")} />
      </Appbar.Header>

      <Card style={{ margin: 16, borderRadius: 16, padding: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
            style={{ width: 60, height: 60, borderRadius: 30, marginRight: 16 }}
          />
          <View>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>สมชาย ใจดี</Text>
            <Text style={{ fontSize: 14, color: 'gray' }}>รหัสพนักงาน: SES00001</Text>
            <Text style={{ fontSize: 14, color: 'gray' }}>ตำแหน่ง: พนักงานเซอร์เวย์</Text>
          </View>
        </View>
      </Card>

    
      <Card style={{ marginBottom: 16, borderRadius: 16, padding: 16 , marginLeft: 16 , marginRight: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>สรุปประจำเดือน</Text>
        <Text>สาย: {summary.late} วัน</Text>
        <Text>ป่วย: {summary.sick} วัน</Text>
        <Text>ลา: {summary.leave} วัน</Text>
      </Card>
    </View>
  );
}
