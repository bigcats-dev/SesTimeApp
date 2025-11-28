import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, FlatList, ScrollView } from 'react-native';
import { Text, Appbar, Card, DataTable, Button, Menu, ActivityIndicator } from 'react-native-paper';
import styles from '../styles/style';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import { useDeleteOverTimeMutation, useGetOverTimesQuery } from '../services/overTime';
import { default as OverTimeCardSkeleton } from './../components/skeletions/Leave'
import EmptyList from '../components/EmptyList';
import ConfirmDialog from '../components/ConfirmDialog';
import StatusLeave from '../components/StatusLeave';


export default function OverTime({ navigation }) {
  const [page, setPage] = useState(1);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [id, setId] = useState(null);
  const { data, isLoading, isFetching } = useGetOverTimesQuery({ page, limit: 50 })
  const [deleteOverTime, { isLoading: isDeleting }] = useDeleteOverTimeMutation()

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
    deleteOverTime(id).then((json) => console.log('delete leave successfulty.', JSON.stringify(json)))
  }, [id])

  const renderItem = ({ item }) => (
    <Card
      style={{ marginBottom: 12, borderRadius: 12, padding: 12 }}
      onPress={() => {
        if (item.status === 'PENDING') {
          setId(item.id)
          setDialogVisible(true)
        }
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <MaterialCommunityIcons
          name="clock-outline"
          size={28}
          color="#ff3b30"
          style={{ marginRight: 12 }}
        />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>วันที่ {item.date_thai}</Text>
            <Text style={{ fontSize: 16 }}>OT <Text style={{ color: 'red', fontWeight: 'bold' }}>{item.hours}</Text> ชม</Text>
          </View>
          <Text style={{ fontSize: 14, color: '#555' }}>
            เวลา: {item.start_time} - {item.end_time}
          </Text>
          <Text style={{ fontSize: 14, color: '#555' }}>
            หมายเหตุ: {item.note || '-'}
          </Text>
          <StatusLeave status={item.status} />
        </View>
      </View>
    </Card>
  );

  return (
    <View style={{ flex: 1 }}>
      <AppHeader title="ประวัติการ OT" navigation={navigation} />
      {/* Content */}
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: 16, marginTop: 10 }}>
          {isLoading ? (
            [...Array(10)].map((_, i) => <OverTimeCardSkeleton key={i} />)
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
              <EmptyList icon="calendar-remove-outline" message="ไม่มีรายการการขอโอทีของคุณ" />}
          />)}
        </View>
      </View>
      {/* ปุ่มสร้างการลา */}
      <View style={styles.bottomBar}>
        <Button
          mode="contained"
          icon="clock-plus-outline"
          onPress={() => navigation.navigate('OverTimeAgenda', { from: 'stack' })}
          style={styles.addButton}
          labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
        >
          ขอ OT
        </Button>
      </View>
      <ConfirmDialog
        visible={dialogVisible}
        onDismiss={onDismiss}
        onConfirm={handleConfirmDelete}
        title="ยกเลิกรายการ"
        message="คุณต้องการยกเลิกรายการการขอโอทีหรือไม่?"
      />
    </View>
  );
}
