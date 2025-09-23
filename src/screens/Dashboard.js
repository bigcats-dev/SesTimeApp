import React from 'react';
import { View, Image } from 'react-native';
import { Text, Appbar, TouchableRipple , Card } from 'react-native-paper';
import styles from '../styles/style'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; // เปลี่ยนเป็น MaterialCommunityIcons

export default function Dashboard({ navigation }) {

  const menus = [
    { title: 'ลงเวลาเข้างาน', icon: 'qrcode-scan', color: '#EB5757', navigate: 'CheckIn' },
    { title: 'ตารางการทำงาน', icon: 'calendar-month', color: '#5b86e5', navigate: 'Schedule' },
    { title: 'การลา', icon: 'briefcase-clock', color: '#0072ff', navigate: 'Leave' },
    { title: 'ประวัติ', icon: 'history', color: '#f7971e', navigate: 'History' },
  ];


  return (
    <View style={{ flex: 1 }}> 
      <Appbar.Header style={styles.appbar}>
        <Appbar.Action
          icon="menu" 
          color="#ff3b30"
          onPress={() => navigation.openDrawer()}
        />
        <Appbar.Content title="Dashboard"  titleStyle={{ textAlign: 'center', color: "white" }} />
        {/* <Image source={{ uri: 'https://i.pravatar.cc/150?img=12' }} style={styles.profileImage} /> */} 
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
 
      <View style={styles.container}>
        <View style={styles.cardRow}>
          {menus.map((menu, index) => (
            <TouchableRipple
              key={index}
              style={{
                width: '48%',
                borderRadius: 16,
                backgroundColor: menu.color,  
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 24,
                marginBottom: 12,
              }}
              onPress={() => navigation.navigate(menu.navigate)}
              rippleColor="rgba(255,255,255,0.3)"
            >
              <View style={{ alignItems: 'center' }}>
                <MaterialCommunityIcons name={menu.icon} size={40} color="#fff" />
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff', marginTop: 8 }}>
                  {menu.title}
                </Text>
              </View>
            </TouchableRipple>
          ))}
        </View>
      </View>
    </View>
  );
}
