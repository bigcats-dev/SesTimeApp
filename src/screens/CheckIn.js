import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function CheckIn({ navigation }) {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">CheckIn</Text>
      <Button mode="contained" onPress={() => navigation.navigate('CheckIn')} style={styles.button}>Check In</Button>
      <Button mode="contained" onPress={() => navigation.navigate('History')} style={styles.button}>History</Button>
      <Button mode="contained" onPress={() => navigation.navigate('Schedule')} style={styles.button}>Schedule</Button>
      <Button mode="contained" onPress={() => navigation.navigate('Leave')} style={styles.button}>Leave</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  button: { marginVertical: 8, width: '80%' }
});
