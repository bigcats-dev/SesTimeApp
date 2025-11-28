import { View, Text, KeyboardAvoidingView, ScrollView, Platform, Alert } from 'react-native'
import React, { useCallback, useState } from 'react'
import AppHeader from '../components/AppHeader'
import { Button, Card, Divider, RadioButton, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { isEmptyString, toDateThai } from '../utils';
import Error from '../components/Error';
import { useCreateOverTimeMutation } from '../services/overTime';
import styles from '../styles/style';
import ConfirmDialog from '../components/ConfirmDialog';

const OverTimeForm = ({ navigation, route }) => {
  const { item, section } = route.params;
  const [type, setType] = useState('');
  const [reason, setReason] = useState('');
  const [hours, setHours] = useState('');
  const [errors, setErrors] = useState({ type: '', reason: '', hours: '' });
  const [dialogVisible, setDialogVisible] = useState(false);
  const [createOverTime, { isLoading: isCreating }] = useCreateOverTimeMutation()


  const onDismiss = useCallback(() => {
    setDialogVisible(false)
  }, [])

  const onTypeChange = (value) => {
    setType(value);
    setErrors((prev) => ({
      ...prev, type: isEmptyString(value)
        ? 'กรุณาเลือกช่วงเวลา'
        : ''
    }));
  }

  const onChangeTextHours = (text) => {
    setHours(text)
    setErrors((prev) => ({
      ...prev, hours: isEmptyString(text)
        ? 'กรุณากรอกจำนวนชั่วโมง OT'
        : ''
    }));
  }

  const onChangeTextReason = (text) => {
    setReason(text)
    setErrors((prev) => ({
      ...prev, reason: isEmptyString(text)
        ? 'กรุณากรอกหมายเหตุการขอ OT'
        : ''
    }));
  }

  const hasAnyError = (errors) => {
    if (!errors) return false;
    if (errors.type && errors.type.trim() !== '') return true;
    if (errors.reason && errors.reason.trim() !== '') return true;
    if (errors.hours && errors.hours.trim() !== '') return true;
    return false;
  };

  const handleSubmit = useCallback(async () => {
    try {
      const payload = {
        date: section.title,
        type,
        note: reason,
        hours,
        shift: item
      }
      await createOverTime(payload).unwrap();
      navigation.navigate('OverTime', { from: route.params?.from || 'stack' });
    } catch (err) {
      if (err.status === 422) {
        console.warn('❌ OT validation error:', err.data?.message || err.data);
        Alert.alert('แจ้งเตือน', err.data?.message || 'ข้อมูลไม่ถูกต้อง');
      } else {
        console.error('❌ Error saving OT:', err);
        Alert.alert('เกิดข้อผิดพลาดในการบันทึก OT');
      }
    } finally {
      onDismiss();
    }
  }, [type, reason, hours]);

  const handleConfirm = () => {
    const errors = {};
    if (!type) errors.type = 'กรุณาเลือกช่วงเวลา';
    if (!reason) errors.reason = 'กรุณากรอกหมายเหตุ';
    if (!hours) errors.hours = 'กรุณากรอกจำนวนชั่วโมง OT';
    setErrors(errors);
    if (!hasAnyError(errors)) {
      setDialogVisible(true);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={{ flex: 1 }}>
        <AppHeader title={'สร้างการขอ OT'} />
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 100,
          }}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always">
          <View style={{ backgroundColor: '#fff', padding: 10 }}>
            <Card style={{ marginBottom: 16 }}>
              <Card.Title
                titleStyle={{ fontWeight: 'bold' }}
                title={`วันที่ ${toDateThai(section.title)}`} />
              <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 8 }}>
                <MaterialCommunityIcons
                  name={item.isDayOff ? 'calendar-remove' : 'calendar-clock'}
                  size={28}
                  color={item.isDayOff ? '#ff3b30' : '#0072ff'}
                  style={{ marginRight: 12 }}
                />
                <Text style={{ fontWeight: 'bold' }}>เวลาการทำงาน : {item.start} - {item.end}</Text>
              </View>
              <Card.Content>
                <Text style={{ marginBottom: 4 }}>เลือกช่วงเวลา:</Text>
                <RadioButton.Group
                  onValueChange={value => onTypeChange(value)}
                  value={type}
                >
                  <View style={{ flexDirection: 'column', justifyContent: 'space-around', marginBottom: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <RadioButton value="BEFORE" />
                      <Text>ก่อนเวลาเข้างาน</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <RadioButton value="AFTER" />
                      <Text>หลังเวลาเลิกงาน</Text>
                    </View>
                  </View>
                </RadioButton.Group>
                {
                  isEmptyString(type) && <Error message={errors.type} />
                }
                <Divider style={{ marginVertical: 8 }} />
                <TextInput
                  style={{ marginVertical: 3 }}
                  label="จำนวนชั่วโมง OT"
                  value={hours}
                  onChangeText={onChangeTextHours}
                />
                {isEmptyString(hours) && <Error message={errors.hours} />}
                <TextInput
                  style={{ marginVertical: 3 }}
                  label="หมายเหตุ"
                  value={reason}
                  onChangeText={onChangeTextReason}
                />
                {isEmptyString(reason) && <Error message={errors.reason} />}
              </Card.Content>
            </Card>
          </View>
          <View style={styles.bottomBar}>
            <Button
              mode="contained"
              icon="clock-plus-outline"
              style={styles.addButton}
              labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
              onPress={handleConfirm}
              disabled={isCreating}
            >
              {isCreating ? 'กรุณารอซักครู่...' : 'ส่งขออนุมัติ OT'}
            </Button>
          </View>
        </ScrollView>
        <ConfirmDialog
          visible={dialogVisible}
          onDismiss={onDismiss}
          onConfirm={handleSubmit}
          title="ยืนยันการสร้าง"
          message="ยืนยันการสร้างใบลาใช่หรือไม่?"
        />
      </View>
    </KeyboardAvoidingView >
  )
}

export default OverTimeForm