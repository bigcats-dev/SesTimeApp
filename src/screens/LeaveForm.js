import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, View, Platform, KeyboardAvoidingView } from 'react-native';
import { Appbar, RadioButton, Card, Divider, Checkbox, Text, Button, TextInput, Snackbar } from 'react-native-paper';
import * as FileSystem from 'expo-file-system/legacy';


import styles from '../styles/style';
import WorkCalendar from '../components/Calendar';
import { getDateMinusDays, isEmptyString, toDateThai } from '../utils';
import CustomMenu from '../components/CustomMenu';
import { useCreateLeaveMutation } from '../services/leave';
import AppHeader from '../components/AppHeader';
import { useLazyGetScheduleQuery } from '../services/schedule';
import { useGetLeaveTypeQuery } from '../services/master';
import ConfirmDialog from '../components/ConfirmDialog';
import Error from '../components/Error';
import FileAttachment from '../components/FileAttachment';
import { useSnackbar } from '../components/SnackbarContext';

export default function LeaveForm({ navigation }) {
  const [items, setItems] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState(null)
  const [reason, setReason] = useState('')
  const [file, setFile] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [errors, setErrors] = useState({ type: '', reason: '', days: [] });
  const { data: leaveTypes } = useGetLeaveTypeQuery();
  const [fetchSchedule, { isFetching }] = useLazyGetScheduleQuery();
  const [createLeave, { isLoading: isCreating }] = useCreateLeaveMutation()
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const generateItems = async () => {
      // fetch API
      if (isEmptyString(startDate)) return;
      try {
        const response = await fetchSchedule({ startDate, endDate }).unwrap();
        const filtered = response.filter(item => {
          // ไม่ต้องการวันที่มีกะการทำงานข้ามวัน
          // 2025-12-10 → กะข้ามวัน (startDate)
          // 2025-12-09 → รายการของวันก่อนหน้า (shift day) (ไม่ต้องการ)
          return new Date(item.title) >= new Date(startDate);
        });
        console.log('filtered agenda items', JSON.stringify(filtered));
        setItems(filtered ?? []);
      } catch (error) {
        console.error("Error fetching agenda items:", error);
        setItems([]);
      }
    }
    generateItems()
  }, [startDate, endDate]);

  const convertToBase64 = async (uri) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64'
      });
      return base64;
    } catch (error) {
      console.log('convertToBase64 error', error);
      return null;
    }
  };

  const handleDayPress = (day) => {
    const errs = {...errors};
    if (!type) errs.type = 'กรุณาเลือกประเภทการลา';
    setErrors(errs);
    if (hasAnyError(errs)) {
      showSnackbar('กรุณาเลือกประเภทการลาก่อน', { label: 'ตกลง' });
      return;
    }
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
    const updated = items.map(item => ({
      ...item,
      data: item.data.map(shift => ({ ...shift }))
    }));
    const daysError = [...errors.days]
    if (updated[dayIndex]) {
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
      daysError[dayIndex] = daysError[dayIndex] || {};
      daysError[dayIndex].leaveType = isEmptyString(value) ? 'กรุณาเลือกช่วงเวลาการลา' : '';
      if (updated[dayIndex].data.some(d => d.selected === true)) {
        daysError[dayIndex].shift = '';
      } else {
        daysError[dayIndex].shift = 'กรุณาเลือกกะเวลาการทำงาน';
      }
      setItems(updated);
      setErrors((prev) => ({ ...prev, days: daysError }))
    }
  };

  const toggleShift = (dayIndex, shiftIndex) => {
    const updated = items.map(item => ({
      ...item,
      data: item.data.map(shift => ({ ...shift }))
    }));
    const daysError = [...errors.days]
    updated[dayIndex].data[shiftIndex].selected = !updated[dayIndex].data[shiftIndex].selected;
    daysError[dayIndex] = daysError[dayIndex] || {};
    if (updated[dayIndex].data.some(d => d.selected === true)) {
      daysError[dayIndex].shift = '';
    } else {
      daysError[dayIndex].shift = 'กรุณาเลือกกะเวลาการทำงาน';
    }
    setItems(updated);
    setErrors((prev) => ({ ...prev, days: daysError }));
  };

  const prepareLeaveData = (items) => {
    const data = items.flatMap(day =>
      day.data
        .filter(d => d.selected)
        .map(d => ({
          date: day.title,
          type: type,
          leaveDuration: day.leaveType,
          time_work_id: d.id,
          start: d.start,
          end: d.end
        }))
    );
    return {
      type,
      data,
      reason
    };
  }

  const handleSubmit = useCallback(async () => {
    const selectedShifts = prepareLeaveData(items);
    if (file) {
      selectedShifts.file_base64 = await convertToBase64(file.uri);
      selectedShifts.file_ext = getExtension(file.uri);
    }
    if (selectedShifts.length === 0) {
      Alert.alert('กรุณาเลือกกะที่จะลาอย่างน้อย 1 กะ');
      return;
    }
    try {
      await createLeave(selectedShifts).unwrap();
      navigation.goBack();
    } catch (error) {
      console.error('❌ Error saving leave:', JSON.stringify(error));
      Alert.alert('เกิดข้อผิดพลาดในการบันทึกการลา');
    }
  }, [type, items, reason, file]);

  const handleConfirm = () => {
    const errors = {};
    const updated = items.map(item => ({
      ...item,
      data: item.data.map(shift => ({ ...shift }))
    }));
    if (!type) errors.type = 'กรุณาเลือกประเภทการลา';
    if (!reason) errors.reason = 'กรุณากรอกหมายเหตุการลา';
    errors.days = [];
    for (let index = 0; index < updated.length; index++) {
      const {
        leaveType,
        data,
      } = updated[index];
      errors.days[index] = errors.days[index] || {};
      if (!leaveType) {
        errors.days[index].leaveType = 'กรุณาเลือกช่วงเวลาการลา';
      }
      if (!data.some(d => d.selected == true)) {
        errors.days[index].shift = 'กรุณาเลือกกะเวลาการทำงาน';
      }
    }
    setErrors(errors);
    if (!hasAnyError(errors)) {
      setDialogVisible(true);
    } else {
      showSnackbar('กรุณาตรวจสอบข้อมูลการลาก่อนส่งคำขอ', { label: 'ตกลง' });
    }
  }

  const hasAnyError = (errors) => {
    if (!errors) return false;
    if (errors.type && errors.type.trim() !== '') return true;
    if (errors.reason && errors.reason.trim() !== '') return true;
    if (Array.isArray(errors.days)) {
      return errors.days.some(day => {
        if (!day) return false;
        return Object.values(day).some(msg => !isEmptyString(msg));
      });
    }
    return false;
  };

  const onDismiss = useCallback(() => {
    setDialogVisible(false)
  }, [])

  const onSelectType = useCallback((type) => {
    setType(type)
    setErrors((prev) => ({ ...prev, type: '' }));
  }, [])

  const onChangeTextReason = (text) => {
    setReason(text)
    setErrors((prev) => ({
      ...prev, reason: isEmptyString(text)
        ? 'กรุณากรอกหมายเหตุการลา'
        : ''
    }));
  }

  const onChangeFile = useCallback((files) => {
    if (__DEV__) {
      console.log('files attachment', files)
    }
    setFile(files[0] ?? [])
  }, [])

  const getExtension = (uri) => {
    return uri.split('.').pop().split('?')[0];
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={{ flex: 1 }}>
        <AppHeader title={'สร้างการลา'} />
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 100,
          }}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always">
          <View style={{ backgroundColor: '#fff', padding: 10 }}>
            <Text style={{ fontWeight: 'bold', color: '#000' }}>เลือกประเภทการลา</Text>
            <CustomMenu
              anchorText={type?.name ?? 'เลือกประเภทการลา'}
              items={leaveTypes?.data ?? []}
              onSelect={onSelectType} />
            {!isEmptyString(errors.type) && <Error message={errors.type} />}
            <WorkCalendar
              onDayPress={handleDayPress}
              startDate={startDate}
              endDate={endDate}
              minDate={type?.id == 2
                ? getDateMinusDays(7).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0]
              } />
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
            {items.length > 0 && (
              <View style={{ marginVertical: 10 }}>
                <Text style={{ fontWeight: 'bold', marginVertical: 10 }}>ช่วงวันการลา</Text>
                {items.map((day, dayIndex) => (
                  <Card key={day.title} style={{ marginBottom: 16 }}>
                    <Card.Title
                      titleStyle={{ fontWeight: 'bold' }}
                      title={`วันที่ ${toDateThai(day.title)}`} />
                    <Card.Content>
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
                      {
                        !isEmptyString(errors.days[dayIndex]?.leaveType)
                        && <Error message={errors.days[dayIndex].leaveType} />
                      }
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
                      {
                        !isEmptyString(errors.days[dayIndex]?.shift)
                        && <Error message={errors.days[dayIndex]?.shift} />
                      }
                    </Card.Content>
                  </Card>
                ))}
                <TextInput
                  style={{ marginVertical: 10 }}
                  label="หมายเหตุ"
                  value={reason}
                  onChangeText={onChangeTextReason}
                />
                {!isEmptyString(errors.reason) && <Error message={errors.reason} />}
              </View>
            )}
            {items.length > 0 && (
              <View style={{ marginVertical: 10 }}>
                <FileAttachment onChange={onChangeFile} multiple={false} />
              </View>
            )}
            {items.length > 0 && (
              <View style={styles.bottomBar}>
                <Button
                  mode="contained"
                  icon="clock-plus-outline"
                  style={styles.addButton}
                  labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
                  onPress={handleConfirm}
                  disabled={isCreating}
                >
                  {isCreating ? 'กรุณารอซักครู่...' : 'ส่งขออนุมัติการลา'}
                </Button>
              </View>
            )}
          </View>
          <ConfirmDialog
            visible={dialogVisible}
            onDismiss={onDismiss}
            onConfirm={handleSubmit}
            title="ยืนยันการสร้าง"
            message="ยืนยันการสร้างใบลาใช่หรือไม่?"
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

