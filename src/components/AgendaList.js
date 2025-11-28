import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Image
} from 'react-native';
import {
  AgendaList,
  CalendarProvider,
  ExpandableCalendar
} from 'react-native-calendars';
import AgendaItem from './AgendaItem';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const leftArrowIcon = require('../img/previous.png');
const rightArrowIcon = require('../img/next.png');
const CHEVRON = require('../img/next.png');

export default function CustomAgendaListExample({
  items,
  markedDates,
  onMonthChange,
  onAgendaItemPress = () => {}
}) {
  const [ready, setReady] = useState(false);
  const firstDate = items.length > 0 ? items[0].title : new Date().toISOString().split('T')[0];
  const renderItem = useCallback(({ item, section }) => {
    return <AgendaItem onAgendaItemPress={onAgendaItemPress} section={section} item={item} />;
  }, [onAgendaItemPress]);

  const calendarRef = useRef(null);
  const rotation = useRef(new Animated.Value(0));

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const toggleCalendarExpansion = useCallback(() => {
    const isOpen = calendarRef.current?.toggleCalendarPosition();
    Animated.timing(rotation.current, {
      toValue: isOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease)
    }).start();
  }, []);

  const renderHeader = useCallback(
    (date) => {
      const rotationInDegrees = rotation.current.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '-180deg']
      });

      return (
        <TouchableOpacity style={styles.header} onPress={toggleCalendarExpansion}>
          <Text style={styles.headerTitle}>
            {date?.toString('MMMM yyyy')}
          </Text>
          <Animated.Image
            source={CHEVRON}
            style={{
              tintColor: '#555',
              transform: [{ rotate: '90deg' }, { rotate: rotationInDegrees }]
            }}
          />
        </TouchableOpacity>
      );
    },
    [toggleCalendarExpansion]
  );

  const onCalendarToggled = useCallback(
    (isOpen) => {
      rotation.current.setValue(isOpen ? 1 : 0);
    },
    [rotation]
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="calendar-blank-outline" size={60} color="#ccc" />
      <Text style={styles.emptyText}>ไม่มีรายการในวันนี้</Text>
    </View>
  );

  if (!ready) return null;
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <CalendarProvider
        date={firstDate}
        showTodayButton
        onMonthChange={onMonthChange}
      >
        <ExpandableCalendar
          testID="expandableCalendar"
          renderHeader={renderHeader}
          ref={calendarRef}
          onCalendarToggled={onCalendarToggled}
          initialPosition={ExpandableCalendar.positions.OPEN}
          disableWeekScroll
          disableAllTouchEventsForDisabledDays={true}
          firstDay={1}
          markedDates={markedDates}
          leftArrowImageSource={leftArrowIcon}
          rightArrowImageSource={rightArrowIcon}
          theme={{
            todayTextColor: '#ff7f50',
            selectedDayBackgroundColor: '#ff7f50',
            selectedDayTextColor: '#fff',
            monthTextColor: '#333',
            textDayFontWeight: '500',
            arrowColor: '#ff7f50',
            backgroundColor: '#fff'
          }}
        />

        <AgendaList
          testID="agendalist"
          sections={items}
          renderItem={renderItem}
          ListEmptyComponent={renderEmptyList}
          sectionStyle={styles.section}
        />
      </CalendarProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 6,
    color: '#333'
  },
  section: {
    backgroundColor: '#f2f7f7',
    color: '#666',
    textTransform: 'capitalize',
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontWeight: '600',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd'
  },
  emptyContainer: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    marginTop: 10
  }
});
