import React, { useState, useRef, useEffect } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { Text, Appbar, Card, DataTable, Button, Menu } from 'react-native-paper';
import styles from '../styles/style';

export default function History({ navigation }) {
  const [month, setMonth] = useState('กันยายน 2025');
  const [menuVisible, setMenuVisible] = useState(false);

  const scrollRef = useRef(null);  

  const historyData = Array.from({ length: 30 }, (_, i) => {
    const day = (i + 1).toString().padStart(2, '0');
    const shift = i % 2 === 0 ? 'เช้า' : 'บ่าย';
    const checkIn = shift === 'เช้า' ? '08:00' : '13:00';
    const checkOut = shift === 'เช้า' ? '17:00' : '22:00';
    return { date: `${day}/09/2025`, shift, checkIn, checkOut };
  });
 
  const today = new Date();
  const todayStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth()+1).toString().padStart(2,'0')}/2025`;
  const todayIndex = historyData.findIndex(item => item.date === todayStr);

  useEffect(() => {
    if (scrollRef.current && todayIndex >= 0) { 
      scrollRef.current.scrollTo({ y: todayIndex * 48, animated: true });
    }
  }, [todayIndex]);

  const summary = { late: 1, sick: 1, leave: 1 };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Action icon="arrow-left" color="#ff3b30"    onPress={() => navigation.goBack()} />
        <Appbar.Content title="ประวัติการลงเวลาทำงาน" titleStyle={{ textAlign: 'center', color: "white" }} />
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

      <View style={{ padding: 16, flexDirection: 'row', justifyContent: 'flex-start' }}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button mode="outlined" style={{color:'#000'}} labelStyle={{color:'#ff3b30'}} onPress={() => setMenuVisible(true)}>
              {month}
            </Button>
          }
        >
          <Menu.Item onPress={() => { setMonth('สิงหาคม 2025'); setMenuVisible(false); }} title="สิงหาคม 2025" />
          <Menu.Item onPress={() => { setMonth('กันยายน 2025'); setMenuVisible(false); }} title="กันยายน 2025" />
          <Menu.Item onPress={() => { setMonth('ตุลาคม 2025'); setMenuVisible(false); }} title="ตุลาคม 2025" />
        </Menu>
      </View>

      <ScrollView ref={scrollRef} style={{ paddingHorizontal: 16 }}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>วันที่</DataTable.Title>
            <DataTable.Title>เวร</DataTable.Title>
            <DataTable.Title>เวลาเข้า</DataTable.Title>
            <DataTable.Title>เวลาออก</DataTable.Title>
          </DataTable.Header>

          {historyData.map((item, index) => {
            const isToday = item.date === todayStr;
            return (
              <DataTable.Row
                key={index}
                onPress={() => navigation.navigate('HistoryDetail', { record: item })}
                style={{ backgroundColor: isToday ? '#ffe6e6' : 'transparent' }}
              >
                <DataTable.Cell>{item.date}</DataTable.Cell>
                <DataTable.Cell>{item.shift}</DataTable.Cell>
                <DataTable.Cell>{item.checkIn}</DataTable.Cell>
                <DataTable.Cell>{item.checkOut}</DataTable.Cell>
              </DataTable.Row>
            );
          })}
        </DataTable> 
      </ScrollView>

      <Card style={{ marginBottom: 16, borderRadius: 16, padding: 16 , marginLeft: 16 , marginRight: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>สรุปประจำเดือน</Text>
        <Text>สาย: {summary.late} วัน</Text>
        <Text>ป่วย: {summary.sick} วัน</Text>
        <Text>ลา: {summary.leave} วัน</Text>
      </Card>
      
    </View>
  );
}
