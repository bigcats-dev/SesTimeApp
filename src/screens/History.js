import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { Text, Appbar, Card, DataTable, Button, Menu, ActivityIndicator } from 'react-native-paper';
import styles from '../styles/style';
import { useRoute } from '@react-navigation/native';
import { useGetTimeStampHistoryQuery, useLazyGetTimeStampHistoryQuery } from '../services/schedule';
import { generateThaiMonths, getCurrentDatetime, toDateThai } from '../utils';
import { default as HistorySkeleton } from './../components/skeletions/History'
import AppHeader from '../components/AppHeader';
import CustomMenu from '../components/CustomMenu';

export default function History({ navigation, route }) {
  const refreshKey = route?.params?.refresh;
  const currentDate = getCurrentDatetime();
  const [month, setMonth] = useState(currentDate.month);
  const { data: historyData, isLoading, refetch } = useGetTimeStampHistoryQuery(
    { month },
    { skip: !month }
  );
  const scrollRef = useRef(null);
  const todayStr = currentDate.date;
  const todayIndex = historyData?.days?.findIndex(item => item.date === todayStr);

  useEffect(() => {
    if (scrollRef.current && todayIndex >= 0) {
      scrollRef.current.scrollTo({ y: todayIndex * 48, animated: true });
    }
  }, [todayIndex]);

  useEffect(() => {
    if (refreshKey) {
      refetch();
    }
  }, [refreshKey]);

  const months = useMemo(() => generateThaiMonths(), [])

  const onMonthChange = useCallback(({ id }) => {
    setMonth(id)
  }, [])

  const summary = historyData?.summary;

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      <AppHeader title={'ประวัติการลงเวลา'} />
      <View style={{ padding: 16, flexDirection: 'row', justifyContent: 'flex-start' }}>
        <CustomMenu
          anchorText={`เดือน ${months[parseInt(month - 1)]?.name}`}
          items={months}
          onSelect={onMonthChange} />
      </View>
      {isLoading && [...Array(10)].map((_, i) => <HistorySkeleton key={i} />)}
      {historyData && Array.isArray(historyData.days) && (
        <>
          <ScrollView ref={scrollRef} style={{ paddingHorizontal: 16 }}>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title textStyle={{ fontWeight: 'bold', fontSize: 16 }}>วันที่</DataTable.Title>
                <DataTable.Title textStyle={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center', width: '100%' }}>
                  เวลาเข้า
                </DataTable.Title>
                <DataTable.Title textStyle={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center', width: '100%' }}>
                  เวลาออก
                </DataTable.Title>
              </DataTable.Header>

              {historyData.days.map(({ date, schedules, leave }, index) => {
                const isToday = date === todayStr;
                return (
                  <View key={index}>
                    <DataTable.Row
                      onPress={() => navigation.navigate('HistoryDetail', { record: date })}
                      style={{ backgroundColor: isToday ? '#fbd5d5ff' : '#fcf6f6ff' }}
                    >
                      <DataTable.Cell collapsable={1}>
                        {toDateThai(date)}
                      </DataTable.Cell>
                      <DataTable.Cell>
                        {leave && (
                          <View style={{ flex: 1 }}>
                            <Text style={{ color: 'red' }}>📅 {leave.type}</Text>
                            <View>
                              {leave.details?.map((shift, i) => (
                                <Text key={`shift_${i}`} style={[styles.leaveText, {
                                  marginHorizontal: 20
                                }
                                ]}>{shift.start_time} - {shift.end_time}</Text>
                              ))}
                            </View>
                          </View>
                        )}
                      </DataTable.Cell>
                    </DataTable.Row>
                    {schedules?.map(({ id, start_time, end_time, timestamp }) => {
                      const isLeave = leave?.details?.some(l => l.time_work_id == id && l.duation === 'FULL')
                      return (
                        <DataTable.Row key={`${date}_${start_time}`}>
                          <DataTable.Cell>
                            <Text style={{ marginHorizontal: 10 }}>{start_time} - {end_time}</Text>
                          </DataTable.Cell>
                          {isLeave
                            ? (
                              <>
                                <DataTable.Cell style={{backgroundColor: '#eea5a5ff'}} collapsable={2}>
                                  <Text style={{textAlign: 'center', color: '#000'}}>ลาเต็มวัน</Text>
                                </DataTable.Cell>
                              </>
                            )
                            : (
                              <>
                                <DataTable.Cell textStyle={{ textAlign: 'center' }}>
                                  <Text style={{ textAlign: 'center', width: '100%', color: timestamp?.keeping_status?.id == 1 ? 'green' : (timestamp?.keeping_status?.id == 3 ? 'red' : '') }}>
                                    {timestamp?.time_in ?? '-'}
                                  </Text>
                                </DataTable.Cell>
                                <DataTable.Cell>
                                  <Text style={{ textAlign: 'center', width: '100%' }}>{timestamp?.time_out ?? '-'}</Text>
                                </DataTable.Cell>
                              </>
                            )}

                        </DataTable.Row>
                      );
                    })}
                  </View>
                );
              })}
            </DataTable>
          </ScrollView>
          <Card style={{ marginBottom: 16, borderRadius: 16, padding: 16, marginLeft: 16, marginRight: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>สรุปประจำเดือน</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
              สาย: <Text style={{ color: 'red' }}>{summary?.lates}</Text> วัน
            </Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
              ขาด: <Text style={{ color: 'red' }}>{summary?.absent}</Text> วัน
            </Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
              ลา: <Text style={{ color: 'red' }}>{summary.leaves}</Text> วัน
            </Text>
          </Card>
        </>
      )}
    </View>
  );
}
