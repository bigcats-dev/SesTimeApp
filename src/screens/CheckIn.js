import React, { useState } from 'react';
import { View, Image, Text, Modal, StyleSheet } from 'react-native';
import { Appbar, Card, Button } from 'react-native-paper';
import styles from '../styles/style';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function CheckIn({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleCheckIn = () => { 
    setModalVisible(true);
 
    setTimeout(() => setModalVisible(false), 2000);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>  
      <Appbar.Header style={styles.appbar}>
        <Appbar.Action
          icon="menu" 
          color="#ff3b30"
          onPress={() => navigation.openDrawer()}
        />
        <Appbar.Content title="ลงเวลาเข้างาน" titleStyle={{ textAlign: 'center', color: "white" }} /> 
        <Appbar.Action
          icon="bell"
          color="#ff3b30" 
          onPress={() => console.log("กดแจ้งเตือน")}
        />
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

      

      <View style={{ alignItems: 'center' }}>  
        <Button 
          mode="contained" 
          style={styles.buttonCheck}
          labelStyle={styles.labelStyleCheck}
          icon={() => <MaterialCommunityIcons name="qrcode-scan" size={20} color="#fff" />}
          onPress={handleCheckIn}
        >
          ยืนยันลงเวลา
        </Button>

        {/* ข้อความใต้ปุ่ม */}
        <Text
          style={{ marginTop: 12, color: '#0072ff', fontSize: 20, textDecorationLine: 'underline' }}
          onPress={() => navigation.navigate('History')} // กดไปหน้า History
        >
          ดูประวัติการลงเวลา
        </Text>
      </View>



      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.containerCheckin}>
            <MaterialCommunityIcons name="check-circle" size={60} color="#4caf50" />
            <Text style={styles.textCheckin}>ลงเวลาเข้างานสำเร็จ!</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}
 