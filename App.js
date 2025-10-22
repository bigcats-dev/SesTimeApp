import React from 'react';
import { View, Image, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PaperProvider } from 'react-native-paper';
import { Provider, useDispatch } from 'react-redux'


import Login from './src/screens/Login';
import Dashboard from './src/screens/Dashboard';
import CheckIn from './src/screens/CheckIn';
import History from './src/screens/History';
import Schedule from './src/screens/Schedule';
import Leave from './src/screens/Leave';
import HistoryDetail from './src/screens/HistoryDetail';
import LeaveForm from './src/screens/LeaveForm';
import OverTime from './src/screens/OverTime';
import Agenda from './src/screens/Agenda';
import styles from './src/styles/style';
import { useAuthStorage } from './src/hooks/useAuthStorage';
import { LocaleConfig } from 'react-native-calendars';
import { store } from './store';
import SplashScreen from './src/screens/SplashScreen';
import { logoutUser } from './src/services/authSlice';

LocaleConfig.locales['th'] = {
  monthNames: [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ],
  monthNamesShort: [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ],
  dayNames: ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์'],
  dayNamesShort: ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'],
  today: 'วันนี้'
};

LocaleConfig.defaultLocale = 'th';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const dispatch = useDispatch();
  const { state, navigation } = props;
  const { loading: loadingUser, user } = useAuthStorage();
  const activeRoute = state.routeNames[state.index];

  const menuItems = [
    { label: 'Dashboard', icon: 'view-dashboard', route: 'Dashboard', color: '#EB5757' },
    { label: 'ลงเวลาเข้างาน', icon: 'qrcode-scan', route: 'CheckIn', color: '#EB5757' },
    { label: 'ตารางการทำงาน', icon: 'calendar-month', route: 'Agenda', color: '#EB5757' },
    { label: 'การลา', icon: 'briefcase-clock', route: 'LeaveStack', nested: { screen: 'Leave' }, color: '#EB5757' },
    { label: 'ประวัติ', icon: 'history', route: 'HistoryStack', color: '#EB5757' },
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
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
          style={{ width: 60, height: 60, borderRadius: 30, marginRight: 16 }}
        />
        {loadingUser
          ? (<Text>รอซักครู่...</Text>)
          : (
            <View>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>{user?.data?.first_name} {user?.data?.last_name}</Text>
              <Text style={{ fontSize: 14, color: 'gray' }}>รหัสพนักงาน: {user?.data?.user_code}</Text>
              <Text style={{ fontSize: 14, color: 'gray' }}>ตำแหน่ง: {user?.data?.position}</Text>
            </View>
          )
        }
      </View >

      {
        menuItems.map((item, index) => {
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
              onPress={async () => {
                if (item.route === 'Login') {
                  try {
                    await dispatch(logoutUser()).unwrap();
                    navigation.replace(item.route);
                  } catch (err) {
                    Alert.alert('Logout ไม่สำเร็จ', err?.message || 'กรุณาลองใหม่อีกครั้ง');
                  }
                } else if (item.replace) {
                  navigation.replace(item.route);
                } else {
                  navigation.navigate(item.route, item.nested ?? {});
                }
              }}
            />
          );
        })
      }
    </DrawerContentScrollView >
  );
}


function LeaveStack({ route }) {
  return (
    <Stack.Navigator initialRouteName='Leave'>
      <Stack.Screen
        name="Leave"
        component={Leave}
        options={{ headerShown: false }}
        initialParams={{ from: route.params?.from || 'drawer' }}
      />
      <Stack.Screen
        name="LeaveForm"
        component={LeaveForm}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function HistoryStack() {
  return (
    <Stack.Navigator initialRouteName='History'>
      <Stack.Screen
        name="History"
        component={History}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HistoryDetail"
        component={HistoryDetail}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
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
      <Drawer.Screen name="Agenda" component={Agenda} />
      <Drawer.Screen name="LeaveStack" component={LeaveStack} />
      <Drawer.Screen name="HistoryStack" component={HistoryStack} />
      <Drawer.Screen name="OverTime" component={OverTime} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Splash' screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="MainDrawer" component={DrawerNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}
