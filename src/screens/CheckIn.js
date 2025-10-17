import React, { useState } from 'react';
import { View, Image, Text, Modal, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Appbar, Card, Button } from 'react-native-paper';
import styles from '../styles/style';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useCurrentLocation from '../hooks/useCurrentLocation';
import * as LocalAuthentication from 'expo-local-authentication';
import Loading from '../components/Loading';
import { useRoute } from '@react-navigation/native';

const TIPS = [
  {
    id: '1',
    title: 'เปิด GPS ก่อนกดลงเวลา',
    desc: 'ตรวจสอบให้แน่ใจว่าได้เปิด Location (GPS) บนมือถือ เพื่อให้ระบบตรวจสอบตำแหน่งได้ถูกต้อง',
  },
  {
    id: '2',
    title: 'อยู่ในรัศมีออฟฟิศไม่เกิน 20 เมตร',
    desc: 'ระบบจะเทียบตำแหน่ง GPS ของมือถือกับพิกัดที่บริษัทกำหนด หากอยู่ไกลเกิน จะไม่สามารถกดลงเวลาได้',
  },
  {
    id: '3',
    title: 'เช็กอินเทอร์เน็ตให้พร้อม',
    desc: 'มือถือควรเชื่อมต่ออินเทอร์เน็ต (WiFi หรือ 4G/5G) เพราะระบบต้องส่งข้อมูลตำแหน่งไปยังเซิร์ฟเวอร์',
  },
  {
    id: '4',
    title: 'กดลงเวลาก่อนเวลาเข้างาน',
    desc: 'แนะนำให้มากดลงเวลาก่อนเวลาทำงานเล็กน้อย เพื่อป้องกันปัญหาสัญญาณช้า/อินเทอร์เน็ตติดขัด',
  },
  {
    id: '5',
    title: 'ตรวจสอบผลการบันทึกทุกครั้ง',
    desc: 'หลังจากกดลงเวลา ให้เช็กในแอพว่ามีการบันทึกสำเร็จจริง (ขึ้นสถานะ “ลงเวลาแล้ว”) เพื่อความมั่นใจ',
  },
];

export default function CheckIn({ navigation }) {
  const route = useRoute();
  const { getLocation } = useCurrentLocation();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const from = route.params?.from || 'drawer';
  const handleCheckIn = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        throw new Error('ไม่พบอุปกรณ์หรือยังไม่ได้ตั้งค่าชีวภาพ\nกรุณาตั้งค่าลายนิ้วมือหรือใบหน้าในอุปกรณ์ของคุณ');
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'ยืนยันตัวตนด้วยลายนิ้วมือหรือใบหน้า',
        fallbackLabel: 'ใช้รหัสผ่าน',
        cancelLabel: 'ยกเลิก',
      });

      if (!result.success) {
        throw new Error('ยืนยันตัวตนไม่สำเร็จ\nกรุณาลองใหม่อีกครั้ง');
      }

      setLoading(true);

      const loc = await getLocation();
      if (!loc) {
        throw new Error('ไม่สามารถดึงตำแหน่งได้');
      }

      const payload = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        timestamp: new Date().toISOString(),
      };

      // const response = await fetch('https://your-api-endpoint.com/checkin', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload),
      // });

      // if (!response.ok) {
      //   throw new Error('ไม่สามารถส่งข้อมูลลงเวลาได้');
      // }

      // const data = await response.json();
      // console.log('Check-in response:', data);
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false)
      }, 1000);
    } catch (error) {
      console.error('Check-in Error:', error);
      Alert.alert(
        'เกิดข้อผิดพลาด',
        error.message || 'เกิดข้อผิดพลาดไม่ทราบสาเหตุ'
      );
    } finally {
      setLoading(false);
    }
  };

  const onTipPress = (item) => {
    Alert.alert(item.title, item.desc);
  };

  const renderTip = ({ item }) => (
    <TouchableOpacity onPress={() => onTipPress(item)}>
      <Card style={styles.tipCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons
            name="lightbulb-on"
            size={26}
            color="#ff9800"
            style={{ marginRight: 12 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.tipTitle}>{item.title}</Text>
            <Text style={styles.tipDesc}>{item.desc}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

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
          title="ลงเวลาเข้างาน"
          titleStyle={{ textAlign: 'center', color: 'white' }}
        />
        <Appbar.Action
          icon="bell"
          color="#ff3b30"
          onPress={() => console.log('กดแจ้งเตือน')}
        />
      </Appbar.Header>

      <View style={{ flex: 1, paddingHorizontal: 16, marginTop: 10 }}>
        <Text style={styles.sectionTitle}>คำแนะนำก่อนการลงเวลาเข้างาน</Text>
        <FlatList
          data={TIPS}
          keyExtractor={(i) => i.id}
          renderItem={renderTip}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </View>

      <View style={{ alignItems: 'center', marginBottom: 40 }}>
        <Button
          mode="contained"
          style={styles.buttonCheck}
          labelStyle={styles.labelStyleCheck}
          icon={() => (
            <MaterialCommunityIcons name="qrcode-scan" size={20} color="#fff" />
          )}
          onPress={handleCheckIn}
        >
          ยืนยันลงเวลา
        </Button>

        <Text
          style={{
            marginTop: 5,
            color: '#0072ff',
            fontSize: 18,
            textDecorationLine: 'underline',
          }}
          onPress={() => navigation.navigate('History')}
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
            <Text style={styles.textCheckin}>ลงเวลาเข้างานสำเร็จ</Text>
          </View>
        </View>
      </Modal>
      <Loading visible={loading} />
    </View>
  );
}

