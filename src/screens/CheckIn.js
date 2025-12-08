import React, { useEffect, useState } from 'react';
import { View, Image, Text, Modal, StyleSheet, FlatList, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Appbar, Card, Button, ActivityIndicator, TextInput, RadioButton, Divider, TouchableRipple, Checkbox, List } from 'react-native-paper';
import styles from '../styles/style';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import AppHeader from '../components/AppHeader';
import { useGetTipsQuery } from '../services/master';
import { useLazyGetScheduleQuery } from '../services/schedule';
import { getCurrentDatetime, isEmptyString, isNowAfter, subtractLeaveFromWork, toDateThai } from '../utils';
import Error from '../components/Error';
import { default as CardSkeleton } from './../components/skeletions/History'

export default function CheckIn({ navigation }) {
  const { data, isLoading } = useGetTipsQuery();
  const [fetchSchedule, { isFetching }] = useLazyGetScheduleQuery();
  const [scheduleData, setScheduleData] = useState(null);
  const [work_date, setWorkDate] = useState('');
  const [check_type, setType] = useState('');
  const [remark, setRemark] = useState('');
  const [time_work_id, setTimeWorkId] = useState(null);
  const [errors, setErrors] = useState({ time_work_id: '', remark: '', check_type: '' });

  useEffect(() => {
    const startDate = getCurrentDatetime().date;
    const loadData = async () => {
      try {
        const result = await fetchSchedule({ startDate }).unwrap();
        if (__DEV__) console.log('CheckIn scheduleData:', result);
        setScheduleData(result);
        const data = result[0]?.data;
        if (Array.isArray(data) && data.length == 1) {
          setTimeWorkId(data[0]);
        }
      } catch (error) {
        console.error('error', error);
      }
    };
    loadData();
  }, []);

  const hasAnyError = (errors) => {
    if (!errors) return false;
    if (errors.time_work_id && errors.time_work_id.trim() !== '') return true;
    if (errors.check_type && errors.check_type.trim() !== '') return true;
    if (errors.remark && errors.remark.trim() !== '') return true;
    return false;
  };

  const handleCheckIn = async () => {
    try {
      const errors = {};
      if (!time_work_id?.id) errors.time_work_id = 'กรุณาเลือกกะการทำงาน';
      if (!check_type) errors.check_type = 'กรุณาเลือกช่วงเวลาการลงชื่อ';
      if (!remark) errors.remark = 'กรุณากรอกหมายเหตุ';
      setErrors(errors);
      if (hasAnyError(errors)) {
        return;
      }
      if (check_type === 'out' && !isNowAfter(time_work_id.end)) {
        return Alert.alert(
          'ยืนยันการออกงาน',
          `ยังไม่ถึงเวลาออกงาน\nเวลาออกงานของคุณคือเวลา ${time_work_id.end}\nคุณต้องการออกงานตอนนี้หรือไม่?`,
          [
            { text: 'ยกเลิก', style: 'cancel' },
            {
              text: 'ยืนยัน',
              onPress: () => proceedCheckIn(),
            },
          ]
        );
      }
      proceedCheckIn();
    } catch (error) {
      console.error('Check-in Error:', error);
      Alert.alert(
        'เกิดข้อผิดพลาด',
        error.message || 'เกิดข้อผิดพลาดไม่ทราบสาเหตุ'
      );
    }
  };

  const proceedCheckIn = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        throw new Error(
          'ไม่พบอุปกรณ์หรือยังไม่ได้ตั้งค่าชีวภาพ\nกรุณาตั้งค่าลายนิ้วมือหรือใบหน้าในอุปกรณ์ของคุณ'
        );
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'ยืนยันตัวตนด้วยลายนิ้วมือหรือใบหน้า',
        fallbackLabel: 'ใช้รหัสผ่าน',
        cancelLabel: 'ยกเลิก',
      });

      if (!result.success) {
        throw new Error('ยืนยันตัวตนไม่สำเร็จ\nกรุณาลองใหม่อีกครั้ง');
      }

      navigation.navigate('QRScanner', {
        time_work_id,
        check_type,
        remark,
        work_date,
      });
    } catch (error) {
      Alert.alert('เกิดข้อผิดพลาด', error.message);
    }
  };

  const onTipPress = (item) => {
    Alert.alert(item.title, item.desc);
  };

  const renderTip = ({ item }) => (
    <TouchableOpacity onPress={() => onTipPress(item)}>
      <Card style={styles.tipCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons
            name="lightbulb-on"
            size={26}
            color="#ff9800"
            style={{ marginRight: 12 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.tipTitle}>{item.title}</Text>
            <Text style={styles.tipDesc}>{item.desc}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  const onSetTimeValue = (date, value) => {
    setWorkDate(date)
    setTimeWorkId(value);
    setErrors((prev) => ({
      ...prev, time_work_id: isEmptyString(value)
        ? 'กรุณาเลือกกะการทำงาน'
        : ''
    }));
  }

  const onTypeChange = (value) => {
    setType(value);
    setErrors((prev) => ({
      ...prev, check_type: isEmptyString(value)
        ? 'กรุณาเลือกช่วงเวลา'
        : ''
    }));
  }

  const onChangeTextRemark = (text) => {
    setRemark(text)
    setErrors((prev) => ({
      ...prev, remark: isEmptyString(text)
        ? 'กรุณากรอกหมายเหตุ'
        : ''
    }));
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        {/* Header */}
        <AppHeader title={'ลงเวลาเข้า-ออกงาน'} />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        >
          {/* Tips Section */}
          <Text style={styles.sectionTitle}>คำแนะนำก่อนการลงเวลาเข้างาน</Text>

          {isLoading && isFetching && [...Array(5)].map((_, i) => <CardSkeleton key={i} />)}

          <List.Section>
            {data?.data?.map((i) => (
              <List.Accordion
                key={i.id}
                title={i.title || `Tip ${i.id}`}
                titleStyle={{ fontWeight: 'bold' }}
              >
                <View style={{ paddingHorizontal: 2, paddingVertical: 8 }}>
                  {renderTip({ item: i })}
                </View>
              </List.Accordion>
            ))}
          </List.Section>

          {/* เมื่อไม่มีตารางงาน */}
          {(!scheduleData || scheduleData.length) && !isFetching === 0 ? (
            <View style={{ marginTop: 20, alignItems: "center" }}>
              <Text>ไม่พบข้อมูลตารางงานวันนี้</Text>
            </View>
          ) : (
            <>
              {/* Work Schedule + Form */}
              <View style={{ marginTop: 20 }}>
                <Card style={{ marginBottom: 16 }}>
                  <Card.Content>
                    {scheduleData?.map((schedule) => (
                      <View key={schedule.title}>
                        <Text style={{ fontWeight: 'bold', marginVertical: 1 }}>
                          วันที่ {toDateThai(schedule.title)}
                        </Text>
                        {schedule.data.map((item) => {
                          let newItem = { ...item };
                          if (schedule.is_leave) {
                            const leave = schedule.leave_detail?.find(
                              (l) => l.time_work_id === item.id
                            );

                            if (leave) {
                              const result = subtractLeaveFromWork(
                                item.start,
                                item.end,
                                leave.start_time,
                                leave.end_time
                              );
                              newItem = {
                                ...newItem,
                                start: result.start,
                                end: result.end,
                                status: 'leave',
                                remark: leave.remark,
                                leave_type: leave.leave_type,
                                leave_duration: leave.leave_duration,
                              };
                            }
                          }
                          return (<TouchableRipple
                            key={item.id}
                            onPress={() => {
                              if (!schedule.is_leave
                                || (
                                  !('status' in newItem)
                                  || (newItem.status === 'leave' && newItem.leave_duration !== 'full'))) {
                                onSetTimeValue(schedule.title, item)
                              }

                            }}
                            style={{ marginBottom: 8 }}
                          >
                            <Card
                              mode="outlined"
                              style={{
                                borderColor: time_work_id?.id == item.id.toString() ? "#e40909ff" : "#ddd",
                                borderRadius: 12,
                              }}
                            >
                              <Card.Content
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <Text variant="titleMedium">
                                  {newItem.start} - {newItem.end}
                                </Text>

                                {newItem.status === 'leave' && newItem.leave_duration === 'full' && (
                                  <Text style={{ color: 'red' }}>{newItem.leave_type}</Text>
                                )}

                                {(!schedule.is_leave || (!('status' in newItem) || (newItem.status === 'leave' && newItem.leave_duration !== 'full'))) && (
                                  <Checkbox
                                    status={time_work_id?.id == item.id.toString() ? "checked" : "unchecked"}
                                  />
                                )}

                              </Card.Content>
                            </Card>
                          </TouchableRipple>)
                        })}
                      </View>
                    ))}
                    {isEmptyString(time_work_id?.id) && <Error message={errors.time_work_id} />}
                  </Card.Content>
                </Card>
                {/* เลือกช่วงเวลา */}
                <Card>
                  <Card.Content>
                    <Text style={{ marginBottom: 4, fontWeight: 'bold' }}>เลือกช่วงเวลาการลงชื่อ</Text>
                    <RadioButton.Group onValueChange={onTypeChange} value={check_type}>
                      <View style={{ flexDirection: 'column', marginBottom: 8 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <RadioButton value="in" />
                          <Text>เข้างาน</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <RadioButton value="out" />
                          <Text>ออกงาน</Text>
                        </View>
                      </View>
                    </RadioButton.Group>
                    {isEmptyString(check_type) && <Error message={errors.check_type} />}
                    <TextInput
                      style={{ marginVertical: 3 }}
                      label="หมายเหตุ"
                      value={remark}
                      onChangeText={onChangeTextRemark}
                    />
                    {isEmptyString(remark) && <Error message={errors.remark} />}
                  </Card.Content>
                </Card>
              </View>

              {/* ปุ่ม */}
              <View style={{ alignItems: 'center', marginTop: 20 }}>
                <Button
                  mode="contained"
                  style={styles.buttonCheck}
                  labelStyle={styles.labelStyleCheck}
                  icon={() => (
                    <MaterialCommunityIcons name="qrcode-scan" size={20} color="#fff" />
                  )}
                  onPress={handleCheckIn}
                >
                  ยืนยันลงเวลา
                </Button>

                <Text
                  style={{
                    marginTop: 5,
                    color: '#0072ff',
                    fontSize: 18,
                    textDecorationLine: 'underline',
                  }}
                  onPress={() => navigation.navigate('History')}
                >
                  ดูประวัติการลงเวลา
                </Text>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

