import isEmpty from 'lodash/isEmpty';
import React, { useCallback } from 'react';
import { StyleSheet, Alert, View, Text, TouchableOpacity, Button } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import StatusLeave from './StatusLeave';
import { Divider } from 'react-native-paper';

const AgendaItem = (props) => {
  const { item, leaveState, toggleShift, onAgendaItemPress, section } = props;
  if (isEmpty(item)) {
    return (
      <View style={styles.emptyItem}>
        <Text style={styles.emptyItemText}>No Events Planned Today</Text>
      </View>
    );
  }
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        if (!item.isLeaveDay) {
          onAgendaItemPress(section, item)
        }
      }}
    >
      <MaterialCommunityIcons
        name={item.isDayOff ? 'calendar-remove' : 'calendar-clock'}
        size={28}
        color={item.isDayOff ? '#ff3b30' : '#0072ff'}
        style={{ marginRight: 12 }}
      />
      <View>
        {item.isLeaveDay
          ? (
            <View>
              <Text style={{ color: 'red' }}>📅 {item.leave?.leave_type}</Text>
              <Text style={styles.leaveText}>📝 {item.leave?.start_time} - {item.leave?.end_time}</Text>
              {/* <View>
                <Text style={[styles.leaveText, { marginHorizontal: 20 }]}>
                  {item.leave?.start_time} - {item.leave?.end_time}
                </Text>
              </View> */}
            </View>
          )
          : (
            <View>
              {leaveState && (
                <Checkbox
                  status={item.selected ? 'checked' : 'unchecked'}
                  onPress={toggleShift}
                />
              )}
              <Text style={styles.itemHourText}>เวลาการ {item.start}-{item.end}</Text>
              {item.overtime?.map((ot) =>
                <View key={ot.id}>
                  <Divider style={{ marginVertical: 8 }} />
                  <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                    ข้อมูลการขอทำ OT <Text style={{ color: 'red', fontWeight: 'bold' }}>{ot.hours}</Text> ชม
                  </Text>
                  <Text style={{ fontSize: 14, color: '#555' }}>
                    เวลา: {ot.start_time} - {ot.end_time}
                  </Text>
                  <Text style={{ fontSize: 14, color: '#555' }}>
                    หมายเหตุ: {ot.note || '-'}
                  </Text>
                  <StatusLeave status={ot.status} />
                </View>
              )}
            </View>)}
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(AgendaItem);

const styles = StyleSheet.create({
  item: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    flexDirection: 'row'
  },
  itemHourText: {
    color: 'black',
    fontWeight: 'bold'
  },
  itemDurationText: {
    color: 'grey',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4
  },
  itemTitleText: {
    color: 'black',
    marginLeft: 16,
    fontWeight: 'bold',
    fontSize: 16
  },
  itemButtonContainer: {
    flex: 1,
    alignItems: 'flex-end'
  },
  emptyItem: {
    paddingLeft: 20,
    height: 52,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey'
  },
  emptyItemText: {
    color: 'lightgrey',
    fontSize: 14
  },
  leaveText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  }
});