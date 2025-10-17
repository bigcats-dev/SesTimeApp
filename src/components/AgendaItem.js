import isEmpty from 'lodash/isEmpty';
import React, { useCallback } from 'react';
import { StyleSheet, Alert, View, Text, TouchableOpacity, Button } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AgendaItem = (props) => {
  const { item, leaveState, toggleShift } = props;

  const buttonPressed = useCallback(() => {
    Alert.alert('Show me more');
  }, []);

  const itemPressed = useCallback(() => {
    Alert.alert(item.title);
  }, [item]);

  if (isEmpty(item)) {
    return (
      <View style={styles.emptyItem}>
        <Text style={styles.emptyItemText}>No Events Planned Today</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.item}>
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
              <Text style={{ color: 'red' }}>ลากิจ</Text>
              <Text style={styles.leaveText}>📝 เหตุผล: {item.reason}</Text>
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
              <Text style={styles.itemHourText}>เวลาการ {item.start}-{item.end}</Text></View>)}
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
  }
});