import React, { useCallback, useEffect, useState } from 'react';
import { View, Image, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { Text, Appbar, Card, Button, ActivityIndicator } from 'react-native-paper';
import styles from '../styles/style';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { useDeleteLeaveMutation, useGetLeavesQuery } from '../services/leave';
import { default as LeaveCardSkeleton } from './../components/skeletions/Leave'
import EmptyList from '../components/EmptyList';
import AppHeader from '../components/AppHeader';
import StatusLeave from '../components/StatusLeave';
import ConfirmDialog from '../components/ConfirmDialog';


export default function Leave({ navigation }) {
  const [page, setPage] = useState(1);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [id, setId] = useState(null);
  const { data, isLoading, isFetching } = useGetLeavesQuery({ page, limit: 50 })
  const [deleteLeave, { isLoading: isDeleting }] = useDeleteLeaveMutation()

  const handleLoadMore = () => {
    const isLastPage = data.meta.current_page === data.meta.last_page;
    if (!isFetching && !isLastPage) {
      setPage((prev) => prev + 1);
    }
  };

  const onDismiss = useCallback(() => {
    setDialogVisible(false)
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    setDialogVisible(false)
    deleteLeave(id).then((json) => console.log('delete leave successfulty.', JSON.stringify(json)))
  }, [id])

  const renderItem = ({ item }) => {
    const grouped = item.data?.reduce((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = [];
      }
      acc[item.date].push(item);
      return acc;
    }, {});
    return (
      <Card
        style={styles.leaveCard}
        onPress={() => {
          if (item.status === 'PENDING') {
            setId(item.id)
            setDialogVisible(true)
          }
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons
            name="calendar-check"
            size={28}
            color="#0072ff"
            style={{ marginRight: 12 }}
          />
          <View style={{ flex: 1 }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Text style={styles.leaveType}>{item.leave_status}</Text>
              <StatusLeave status={item.status} />
            </View>
            <Text style={styles.leaveText}>⏳ จำนวนวันลา: {Object.keys(grouped).length} วัน</Text>
            <Text style={styles.leaveText}>📝 เหตุผล: {item.reason}</Text>
            <View>
              {Object.entries(grouped).map(([date, items]) => (
                <View key={date}>
                  <Text style={styles.leaveText}>📅 วันที่ลา {date}</Text>
                  {items.map(item => (
                    <Text key={item.id} style={[styles.leaveText, {
                      marginHorizontal: 20
                    }
                    ]}>{item.start_time} - {item.end_time}</Text>
                  ))}
                </View>
              ))}
            </View>
          </View>
        </View>
      </Card>
    )
  };


  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <AppHeader title="ประวัติการลา" />
      {/* Content */}
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: 16, marginTop: 10 }}>
          <Text style={styles.sectionTitle}>รายการประวัติการลา</Text>
          {isLoading ? (
            [...Array(10)].map((_, i) => <LeaveCardSkeleton key={i} />)
          ) : (<FlatList
            data={data?.data}
            keyExtractor={(i) => i.id}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            contentContainerStyle={{ paddingBottom: 80 }}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={isFetching ? <ActivityIndicator /> : null}
            ListEmptyComponent={
              <EmptyList icon="calendar-remove-outline" message="ไม่มีรายการลาของคุณ" />}
          />)}
        </View>
      </View>
      <ConfirmDialog
        visible={dialogVisible}
        onDismiss={onDismiss}
        onConfirm={handleConfirmDelete}
        title="ยกเลิกรายการ"
        message="คุณต้องการยกเลิกรายการการลานี้หรือไม่?"
      />
      {/* ปุ่มสร้างการลา */}
      <View style={styles.bottomBar}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('LeaveForm', { from: 'stack' })}
          style={styles.addButton}
          labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
        >
          + สร้างการลา
        </Button>
      </View>
    </View>
  );
}

