import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Appbar, RadioButton, Card, Divider, Checkbox, Text, Button } from 'react-native-paper';
import styles from '../styles/style';
import { AgendaList } from 'react-native-calendars';
import { generateWorkByStartEndDate } from '../mocks/agendaItem';
import WorkCalendar from '../components/Calendar';
import { toDateThai } from '../utils';
import CustomMenu from '../components/CustomMenu';
import { useAuthStorage } from '../hooks/useAuthStorage';

export default function LeaveForm({ navigation }) {
  const { user } = useAuthStorage()
  const [items, setItems] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const leaveTypes = useMemo(() => [
    { id: 1, name: 'ลากิจ' },
    { id: 2, name: 'ลาป่วย' },
    { id: 3, name: 'ลาพักผ่อน' },
    { id: 4, name: 'ลาอื่นๆ' }
  ])

  useEffect(() => {
    const generateItems = async () => {
      // fetch API
      // try {
      //   const response = await fetchWorkDaysByStartEndDate(startDate, endDate);
      //   setItems(response.workDays);
      // } catch (error) {
      //   console.error("Error fetching agenda items:", error);
      //   setItems([]);
      // }

      // mock up data
      const workDays = generateWorkByStartEndDate(startDate, endDate);
      setItems(workDays);
    }
    generateItems()
  }, [startDate, endDate]);

  const handleDayPress = (day) => {
    const date = day.dateString;
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (date < startDate) {
        setEndDate(startDate);
        setStartDate(date);
      } else {
        setEndDate(date);
      }
    }
  };

  function isShiftInPeriod(shift, period) {
    const [shiftStartHour, shiftStartMin] = shift.originalStart.split(':').map(Number);
    const [shiftEndHour, shiftEndMin] = shift.originalEnd.split(':').map(Number);
    const shiftStart = shiftStartHour + shiftStartMin / 60;
    const shiftEnd = shiftEndHour + shiftEndMin / 60;
    if (period === 'morning') return shiftStart < 12;
    if (period === 'afternoon') return shiftEnd > 12;
    return true;
  }

  const applyHalfDayShift = (shift, type) => {
    const fullStart = shift.originalStart;
    const fullEnd = shift.originalEnd;
    if (fullStart === '08:00' && fullEnd === '17:00') {
      if (type === 'morning') return { ...shift, start: '08:00', end: '12:00' };
      if (type === 'afternoon') return { ...shift, start: '13:00', end: '17:00' };
    }
    return { ...shift, start: fullStart, end: fullEnd };
  }

  const handleLeaveTypeChange = (dayIndex, value) => {
    const updated = [...items];
    updated[dayIndex].leaveType = value;
    updated[dayIndex].data = updated[dayIndex].data.map(shift => {
      if (value === 'full') {
        return { ...shift, start: shift.originalStart, end: shift.originalEnd, selected: true };
      }
      if (value === 'morning') {
        if (isShiftInPeriod(shift, 'morning')) {
          return { ...applyHalfDayShift(shift, 'morning'), selected: true };
        } else {
          return { ...shift, selected: false };
        }
      }
      if (value === 'afternoon') {
        if (isShiftInPeriod(shift, 'afternoon')) {
          return { ...applyHalfDayShift(shift, 'afternoon'), selected: true };
        } else {
          return { ...shift, selected: false };
        }
      }

      return shift;
    });

    setItems(updated);
  };

  const toggleShift = (dayIndex, shiftIndex) => {
    const updated = [...items];
    updated[dayIndex].data[shiftIndex].selected = !updated[dayIndex].data[shiftIndex].selected;
    setItems(updated);
  };

  const changeLeaveType = (dayIndex, item) => {
    const updated = [...items];
    updated[dayIndex].type = item;
    setItems(updated);
  }

  const prepareLeaveData = (items) => {
    return items.flatMap(day =>
      day.data
        .filter(d => d.selected)
        .map(d => ({
          date: day.title,
          type: day.type,
          leaveType: day.leaveType,
          start: d.start,
          end: d.end
        }))
    )
  }

  const handleSubmit = async () => {
    const selectedShifts = prepareLeaveData(items);
    if (selectedShifts.length === 0) {
      Alert.alert('กรุณาเลือกกะที่จะลาอย่างน้อย 1 กะ');
      return;
    }
    // call api
    // const payload = {
    //   leaves: selectedShifts
    // };
    // try {
    //   const response = await fetch('https://your-api.com/api/leaves', {
    //     method: 'POST',
    //     body: JSON.stringify(payload),
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${user.token}`
    //     }
    //   });
    //   if (response.status === 201) {

    //   }
    // } catch (error) {
    //   console.error('❌ Error saving leave:', error);
    //   Alert.alert('เกิดข้อผิดพลาดในการบันทึกการลา');
    // }
  };

  return (
    <ScrollView>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <Appbar.Header style={styles.appbar}>
          <Appbar.Action
            icon="arrow-left"
            color="#ff3b30"
            onPress={() => navigation.goBack()}
          />
          <Appbar.Content
            title="สร้างการลา"
            titleStyle={{ textAlign: 'center', color: 'white' }}
          />
          <Appbar.Action
            icon="bell"
            color="#ff3b30"
            onPress={() => console.log('กดแจ้งเตือน')}
          />
        </Appbar.Header>
        <WorkCalendar
          onDayPress={handleDayPress}
          startDate={startDate}
          endDate={endDate} />
        {items.length === 0 && (
          <View style={{
            marginVertical: 50,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text style={{
              fontSize: 24,
              fontWeight: '100'
            }}>เลือกช่วงเวลาวันลา</Text>
          </View>
        )}
        <View style={{ padding: 5 }}>
          {items.map((day, dayIndex) => (
            <Card key={day.title} style={{ marginTop: 16 }}>
              <Card.Title title={`วันที่ ${toDateThai(day.title)}`} />
              <Card.Content>
                <CustomMenu
                  anchorText={day.type?.name ?? 'เลือกประเภทการลา'}
                  items={leaveTypes}
                  onSelect={(item) => changeLeaveType(dayIndex, item)} />
                <Text style={{ marginBottom: 4 }}>เลือกช่วงเวลา:</Text>
                <RadioButton.Group
                  onValueChange={value => handleLeaveTypeChange(dayIndex, value)}
                  value={day.leaveType}
                >
                  <View style={{ flexDirection: 'column', justifyContent: 'space-around', marginBottom: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <RadioButton value="full" />
                      <Text>เต็มวัน</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <RadioButton value="morning" />
                      <Text>ครึ่งเช้า</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <RadioButton value="afternoon" />
                      <Text>ครึ่งบ่าย</Text>
                    </View>
                  </View>
                </RadioButton.Group>
                <Divider style={{ marginVertical: 8 }} />
                {day.data.map((shift, shiftIndex) => (
                  <View key={shift.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Checkbox
                      status={shift.selected ? 'checked' : 'unchecked'}
                      onPress={() => toggleShift(dayIndex, shiftIndex)}
                    />
                    <Text>{`${shift.start} - ${shift.end}`}</Text>
                  </View>
                ))}
              </Card.Content>
            </Card>
          ))}
        </View>
        {items.length > 0 && (
          <View style={styles.bottomBar}>
            <Button
              mode="contained"
              icon="clock-plus-outline"
              style={styles.addButton}
              labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
              onPress={handleSubmit}
            >
              ส่งขออนุมัติการลา
            </Button>
          </View>
        )}

      </View>
    </ScrollView>
  );
}

