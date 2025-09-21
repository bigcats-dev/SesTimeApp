import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/screens/Login';
import Dashboard from './src/screens/Dashboard';
import CheckIn from './src/screens/CheckIn';
import History from './src/screens/History';
import Schedule from './src/screens/Schedule';
import Leave from './src/screens/Leave';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="CheckIn" component={CheckIn} />
          <Stack.Screen name="History" component={History} />
          <Stack.Screen name="Schedule" component={Schedule} />
          <Stack.Screen name="Leave" component={Leave} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
