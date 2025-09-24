import React, { useState } from 'react';
import { View, Image, ScrollView, StyleSheet } from 'react-native';
import { Text, Appbar, Card, Button, TextInput, Menu, Divider, Provider } from 'react-native-paper';
import styles from '../styles/style';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function LeaveForm({ navigation }) {
  const [leaveType, setLeaveType] = useState('ลาป่วย');
  const [menuVisible, setMenuVisible] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [reason, setReason] = useState('');

  const leaveTypes = ['ลาป่วย', 'ลากิจ', 'ลาพักร้อน', 'ลาอื่นๆ'];

  const handleSubmit = () => {
    console.log({ leaveType, startDate, endDate, reason });
    alert('ส่งคำขอลาสำเร็จ!');
  };

  return (
    <Provider>
      <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        {/* Header */}
        <Appbar.Header style={styles.appbar}>
          <Appbar.Action
            icon="arrow-left"
            color="#ff3b30"
            onPress={() => navigation.goBack()}
          />
          <Appbar.Content
            title="สร้างการลา"
            titleStyle={{ textAlign: 'center', color: 'white' }}
          />
          <Appbar.Action
            icon="bell"
            color="#ff3b30"
            onPress={() => console.log('กดแจ้งเตือน')}
          />
        </Appbar.Header>

        <ScrollView contentContainerStyle={{ paddingBottom: 20 , marginTop: 10}}>
  
     
          <Card style={{ marginHorizontal: 16, borderRadius: 8, padding: 15 , }}>
          
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setMenuVisible(true)}
                  style={styles.optleave}
                  contentStyle={{ flexDirection: 'row', justifyContent: 'space-between' }}
                  labelStyle={{color:'black'}}
                  icon={() => <MaterialCommunityIcons name="chevron-down" size={20} color="#ef1b27" />}
                >
                  {leaveType}
                </Button>
              }
            >
              {leaveTypes.map((type) => (
                <Menu.Item
                  key={type}
                  onPress={() => {
                    setLeaveType(type);
                    setMenuVisible(false);
                  }}
                  title={type}
                />
              ))}
            </Menu>
       
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <TextInput
                label="วันที่เริ่มลา"
                placeholder="วว/ดด/ปปปป"
                value={startDate}
                onChangeText={setStartDate} 
                style={[styles.inputleave, { flex: 1, }]} 
                left={<TextInput.Icon icon={() => <MaterialCommunityIcons name="calendar" size={20} />} />}
              />
              <TextInput
                label="เวลา"
                placeholder="ชั่วโมง:นาที"
                value={startTime}
                onChangeText={setStartTime}
                style={[styles.inputleave, { flex: 1, marginLeft: 8 }]} 
                left={<TextInput.Icon icon={() => <MaterialCommunityIcons name="clock-outline" size={20} />} />}
              />
            </View> 
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <TextInput
                label="วันที่สิ้นสุดลา"
                placeholder="วว/ดด/ปปปป"
                value={endDate}
                onChangeText={setEndDate} 
                style={[styles.inputleave, { flex: 1, }]} 
                left={<TextInput.Icon icon={() => <MaterialCommunityIcons name="calendar" size={20} />} />}
              />
              <TextInput
                label="เวลา"
                placeholder="ชั่วโมง:นาที"
                value={endTime}
                onChangeText={setEndTime}
                style={[styles.inputleave, { flex: 1, marginLeft: 8 }]}  
                left={<TextInput.Icon icon={() => <MaterialCommunityIcons name="clock-outline" size={20} />} />}
              />
            </View>
 
            <TextInput
              label="เหตุผลการลา"
              placeholder="ระบุเหตุผล..."
              value={reason}
              onChangeText={setReason}
              multiline
              numberOfLines={4} 
              style={[styles.inputleave, { flex: 1, marginBottom: 16 }]}  
            />
 
          </Card>
        </ScrollView>


        <View style={styles.bottomBar}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.addButton}
            labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
          >
            ส่งคำขอลา
          </Button>
        </View>
      </View>
    </Provider>
  );
}

