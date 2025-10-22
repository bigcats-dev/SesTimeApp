import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';

const StatusLeave = ({ status }) => {
  const getStatusProps = (status) => {
    switch (status) {
      case 'pending':
        return {
          text: 'รอดำเนินการ',
          color: '#FFA500',
          icon: 'clock-outline'
        };
      case 'approve':
        return {
          text: 'อนุมัติ',
          color: '#4CAF50',
          icon: 'check-circle-outline'
        };
      case 'reject':
        return {
          text: 'ไม่อนุมัติ',
          color: '#F44336',
          icon: 'close-circle-outline'
        };
      default:
        return {
          text: 'ไม่ทราบสถานะ',
          color: '#9E9E9E',
          icon: 'help-circle-outline'
        };
    }
  };
  const { text, color, icon } = getStatusProps(status);
  return (
    <View style={styles.container}>
      <Chip
        icon={icon}
        style={{ ...styles.chip, backgroundColor: color + '33' }}
        textStyle={{ color }}>
        {text}
      </Chip>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  chip: {
    paddingHorizontal: 10,
  },
});

export default StatusLeave;
