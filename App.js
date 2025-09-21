import React from 'react';
import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';


import Login from './src/screens/Login';
import Dashboard from './src/screens/Dashboard';
import CheckIn from './src/screens/CheckIn';
import History from './src/screens/History';
import Schedule from './src/screens/Schedule';
import Leave from './src/screens/Leave';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Custom Drawer Content
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Dashboard"
        onPress={() => props.navigation.navigate('Dashboard')}
      />
      <DrawerItem
        label="ลงเวลาเข้างาน"
        onPress={() => props.navigation.navigate('CheckIn')}
      />
      <DrawerItem
        label="ตารางการทำงาน"
        onPress={() => props.navigation.navigate('Schedule')}
      />
      <DrawerItem
        label="การลา"
        onPress={() => props.navigation.navigate('Leave')}
      />
      <DrawerItem
        label="โอที"
        onPress={() => alert('ไปหน้าโอที (ยังไม่สร้าง)')}
      />
      <DrawerItem
        label="ออกจากระบบ"
        onPress={() => props.navigation.replace('Login')}
      />
    </DrawerContentScrollView>
  );
}

// Drawer Navigator
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
