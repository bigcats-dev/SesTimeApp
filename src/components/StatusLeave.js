import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';

const StatusLeave = ({ status, width = 140}) => {
  const getStatusProps = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return {
          text: 'รอดำเนินการ',
          color: '#FFA500',
          icon: 'clock-outline'
        };
      case 'approved':
        return {
          text: 'อนุมัติ',
          color: '#4CAF50',
          icon: 'check-circle-outline'
        };
      case 'rejected':
      case 'cancel':
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
    <View style={[styles.container, { width: width }]}>
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
    marginVertical: 1,
  },
  chip: {
    paddingHorizontal: 1,
  },
});

export default StatusLeave;
