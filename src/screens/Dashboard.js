import React from 'react';
import { View, Image } from 'react-native';
import { Text, Appbar, TouchableRipple } from 'react-native-paper';
import styles from '../styles/style';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

export default function Dashboard({ navigation }) {

  const menus = [
    { title: 'ลงเวลาเข้างาน', icon: 'clock-check-outline', colors: ['#ff5f6d', '#ffc371'], navigate: 'CheckIn' },
    { title: 'ตารางการทำงาน', icon: 'calendar-month', colors: ['#36d1dc', '#5b86e5'], navigate: 'Schedule' },
    { title: 'การลา', icon: 'briefcase-clock', colors: ['#00c6ff', '#0072ff'], navigate: 'Leave' },
    { title: 'ประวัติ', icon: 'history', colors: ['#f7971e', '#ffd200'], navigate: 'History' },
  ];

  return (
    <View style={{ flex: 1 }}>
      {/* Top Menu Bar */}
      <Appbar.Header style={styles.appbar}>
        <Appbar.Action icon="menu" onPress={() => console.log('Menu pressed')} />
        <Appbar.Content title="Dashboard" titleStyle={{ textAlign: 'center', color:"white" }} />
        <Image source={{ uri: 'https://i.pravatar.cc/300' }} style={styles.profileImage} />
      </Appbar.Header>

      {/* Main Content */}
      <View style={styles.container}>
        <View style={styles.cardRow}>
          {menus.map((menu, index) => (
            <TouchableRipple
              key={index}
              style={{ width: '48%', borderRadius: 16 }}
              onPress={() => navigation.navigate(menu.navigate)}
              rippleColor="rgba(255,255,255,0.3)"
            >
              <LinearGradient
                colors={menu.colors}
                style={styles.cardMenu}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                
                <MaterialCommunityIcons name={menu.icon} size={40} color="#fff" />
                <Text style={styles.cardText}>{menu.title}</Text>
              </LinearGradient>
            </TouchableRipple>
          ))}
        </View>
      </View>
    </View>
  );
}
