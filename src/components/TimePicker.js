import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome } from '@expo/vector-icons';

export default function TimeInput({ label = "Select Time", onTimeChange }) {
  const [time, setTime] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedTime) => {
    setShow(Platform.OS === 'ios');
    if (selectedTime) {
      setTime(selectedTime);
      onTimeChange && onTimeChange(selectedTime);
    }
  };

  return (
    <View style={{ marginVertical: 10 }}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShow(true)}>
        <FontAwesome name="clock-o" size={20} style={{ marginRight: 10 }} />
        <Text>{time.toLocaleTimeString()}</Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 5,
    fontWeight: 'bold'
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 5
  }
});
