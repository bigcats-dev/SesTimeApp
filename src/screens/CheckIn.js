import React, { useEffect, useState } from 'react';
import { View, Image, Text, Modal, StyleSheet, FlatList, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Appbar, Card, Button, ActivityIndicator, TextInput, RadioButton, Divider, TouchableRipple, Checkbox, List } from 'react-native-paper';
import styles from '../styles/style';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import AppHeader from '../components/AppHeader';
import { useGetTipsQuery } from '../services/master';
import { useGetScheduleQuery, useLazyGetScheduleQuery } from '../services/schedule';
import { isEmptyString, toDateThai } from '../utils';
import Error from '../components/Error';

export default function CheckIn({ navigation }) {
  const { data, isLoading } = useGetTipsQuery();
  const [fetchSchedule, { isFetching }] = useLazyGetScheduleQuery();
  const [scheduleData, setScheduleData] = useState(null);
  const [check_type, setType] = useState('');
  const [remark, setRemark] = useState('');
  const [time_work_id, setTimeWorkId] = useState('');
  const [errors, setErrors] = useState({ time_work_id: '', remark: '', check_type: '' });

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const startDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const loadData = async () => {
      try {
        const result = await fetchSchedule({ startDate }).unwrap();
        if (__DEV__) console.log('CheckIn scheduleData:', result);
        setScheduleData(result);
        const data = result[0]?.data;
        if (Array.isArray(data) && data.length == 1) {
          setTimeWorkId(String(data[0].id));
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
      if (!time_work_id) errors.time_work_id = 'กรุณาเลือกกะการทำงาน';
      if (!check_type) errors.check_type = 'กรุณาเลือกช่วงเวลาการลงชื่อ';
      if (!remark) errors.remark = 'กรุณากรอกหมายเหตุ';
      setErrors(errors);
      if (hasAnyError(errors)) {
        return;
      }

      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        throw new Error('ไม่พบอุปกรณ์หรือยังไม่ได้ตั้งค่าชีวภาพ\nกรุณาตั้งค่าลายนิ้วมือหรือใบหน้าในอุปกรณ์ของคุณ');
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'ยืนยันตัวตนด้วยลายนิ้วมือหรือใบหน้า',
        fallbackLabel: 'ใช้รหัสผ่าน',
        cancelLabel: 'ยกเลิก',
      });

      if (!result.success) {
        throw new Error('ยืนยันตัวตนไม่สำเร็จ\nกรุณาลองใหม่อีกครั้ง');
      }

      navigation.navigate('QRScanner', {time_work_id, check_type, remark});
    } catch (error) {
      console.error('Check-in Error:', error);
      Alert.alert(
        'เกิดข้อผิดพลาด',
        error.message || 'เกิดข้อผิดพลาดไม่ทราบสาเหตุ'
      );
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

  const onSetTimeValue = (value) => {
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
        <AppHeader title={'ลงเวลาเข้างาน'} />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        >
          {/* Tips Section */}
          <Text style={styles.sectionTitle}>คำแนะนำก่อนการลงเวลาเข้างาน</Text>

          {isLoading && isFetching && <ActivityIndicator />}

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
          {!scheduleData || scheduleData.length === 0 ? (
            <View style={{ marginTop: 20, alignItems: "center" }}>
              <Text>ไม่พบข้อมูลตารางงานวันนี้</Text>
            </View>
          ) : (
            <>
              {/* Work Schedule + Form */}
              <View style={{ marginTop: 20 }}>
                <Card style={{ marginBottom: 16 }}>
                  <Card.Title
                    titleStyle={{ fontWeight: 'bold' }}
                    title={`วันที่ ${toDateThai(scheduleData[0]?.title)}`}
                  />

                  <Card.Content>
                    {/* เลือกกะ */}
                    <Text style={{ marginBottom: 4, fontWeight: 'bold' }}>เลือกกะการทำงาน</Text>

                    {scheduleData[0]?.data.map((item) => (
                      <TouchableRipple
                        key={item.id}
                        onPress={() => onSetTimeValue(item.id.toString())}
                        style={{ marginBottom: 8 }}
                      >
                        <Card
                          mode="outlined"
                          style={{
                            borderColor: time_work_id === item.id.toString() ? "#e40909ff" : "#ddd",
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
                              {item.start} - {item.end}
                            </Text>

                            <Checkbox
                              status={time_work_id === item.id.toString() ? "checked" : "unchecked"}
                            />
                          </Card.Content>
                        </Card>
                      </TouchableRipple>
                    ))}

                    {isEmptyString(time_work_id) && <Error message={errors.time_work_id} />}

                    {/* เลือกช่วงเวลา */}
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

                    <Divider style={{ marginVertical: 8 }} />

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

