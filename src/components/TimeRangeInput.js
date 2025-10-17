import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import MaskedTimeInputPaper from './MaskedTimeInputPaper';

export default function TimeRangeInput({ shift, onChange }) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const parseTime = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return { h, m };
  }

  const validateRange = () => {
    if (!start || !end) return false;

    const { h: sh, m: sm } = parseTime(shift.start);
    const { h: eh, m: em } = parseTime(shift.end);
    const { h: stH, m: stM } = parseTime(start);
    const { h: enH, m: enM } = parseTime(end);

    const now = new Date();
    let shiftStart = new Date(now); shiftStart.setHours(sh, sm, 0, 0);
    let shiftEnd = new Date(now); shiftEnd.setHours(eh, em, 0, 0);
    let startTime = new Date(now); startTime.setHours(stH, stM, 0, 0);
    let endTime = new Date(now); endTime.setHours(enH, enM, 0, 0);

    if (shiftEnd <= shiftStart) shiftEnd.setDate(shiftEnd.getDate() + 1);
    if (endTime <= startTime) endTime.setDate(endTime.getDate() + 1);

    if (startTime < shiftStart || startTime > shiftEnd ||
      endTime < shiftStart || endTime > shiftEnd) {
      Alert.alert('เวลาเริ่มหรือสิ้นสุด ไม่อยู่ในช่วงกะ');
      return false;
    }

    return true;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>กรอกช่วงเวลา เวลาเริ่ม - เวลาสิ้นสุด</Text>
      <View style={styles.row}>
        <View style={{
          flex: 1,
        }}>
          <MaskedTimeInputPaper label="เวลาเริ่ม" time={start} setTime={setStart} />
        </View>
        <View style={{
          flex: 1,
          marginHorizontal: 5
        }}>
          <MaskedTimeInputPaper label="เวลาสิ้นสุด" time={end} setTime={setEnd} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  label: {
    fontWeight: 'bold',
  }
});
