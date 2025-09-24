import React from 'react';
import { View, Image, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';  

import Login from './src/screens/Login';
import Dashboard from './src/screens/Dashboard';
import CheckIn from './src/screens/CheckIn';
import History from './src/screens/History';
import Schedule from './src/screens/Schedule';
import Leave from './src/screens/Leave';
import HistoryDetail from './src/screens/HistoryDetail';
import LeaveForm from './src/screens/LeaveForm';
import OverTime from './src/screens/OverTime';
import styles from './src/styles/style';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
 
function CustomDrawerContent(props) {
  const { state, navigation } = props;
  const activeRoute = state.routeNames[state.index];

  const menuItems = [
    { label: 'Dashboard', icon: 'view-dashboard', route: 'Dashboard', color: '#EB5757' },
    { label: 'ลงเวลาเข้างาน', icon: 'qrcode-scan', route: 'CheckIn', color: '#EB5757' },
    { label: 'ตารางการทำงาน', icon: 'calendar-month', route: 'Schedule', color: '#EB5757' },
    { label: 'การลา', icon: 'briefcase-clock', route: 'Leave', color: '#EB5757' },
    { label: 'ประวัติ', icon: 'history', route: 'History', color: '#EB5757' },
    { label: 'โอที', icon: 'alarm', route: 'OverTime', color: '#EB5757' },
    { label: 'ออกจากระบบ', icon: 'logout', route: 'Login', replace: true, color: '#EB5757' },
  ];

  return (
    <DrawerContentScrollView style={styles.DrawerContent} {...props}>

 
      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        <Image
          source={require('./assets/icon.png')}  
          style={{ width: 100, height: 100, resizeMode: 'contain', marginBottom: 10 }}
        />
        <Text style={{ color: '#EB5757', fontSize: 22, fontWeight: 'bold' }}>
          ระบบลงเวลาพนักงาน
        </Text>
      </View>
      {/* ข้อมูลพนักงาน */}
   
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
          style={{ width: 60, height: 60, borderRadius: 30, marginRight: 16 }}
        />
        <View>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color:'white' }}>สมชาย ใจดี</Text>
          <Text style={{ fontSize: 14, color: 'gray' }}>รหัสพนักงาน: SES00001</Text>
          <Text style={{ fontSize: 14, color: 'gray' }}>ตำแหน่ง: พนักงานเซอร์เวย์</Text>
        </View>
      </View>
  
      {menuItems.map((item, index) => {
        const isActive = activeRoute === item.route;
        return (
          <DrawerItem
            key={index}
            label={item.label}
            icon={({ size }) => (
              <MaterialCommunityIcons
                name={item.icon}
                size={size}
                color={isActive ? item.color : '#ccc'}
              />
            )}
            labelStyle={{
              ...styles.DrawerItem,
              color: isActive ? item.color : styles.DrawerItem.color,
            }}
            style={styles.DrawerItemContainer}
            onPress={() => {
              if (item.alert) {
                alert('ไปหน้าโอที (ยังไม่สร้าง)');
              } else if (item.replace) {
                navigation.replace(item.route);
              } else {
                navigation.navigate(item.route);
              }
            }}
          />
        );
      })}
    </DrawerContentScrollView>
  );
}
 
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="CheckIn" component={CheckIn} />
      <Drawer.Screen name="Schedule" component={Schedule} />
      <Drawer.Screen name="Leave" component={Leave} />
      <Drawer.Screen name="History" component={History} />
      <Drawer.Screen name="HistoryDetail" component={HistoryDetail} />
      <Drawer.Screen name="LeaveForm" component={LeaveForm} />
      <Drawer.Screen name="OverTime" component={OverTime} />
    </Drawer.Navigator>
  );
}
 
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="MainDrawer" component={DrawerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
