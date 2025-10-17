import React, { useCallback, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { AgendaList, CalendarProvider, ExpandableCalendar } from 'react-native-calendars';
import AgendaItem from './AgendaItem';

const leftArrowIcon = require('../img/previous.png');
const rightArrowIcon = require('../img/next.png');
const CHEVRON = require('../img/next.png');

export default function CustomAgendaListExample({ items, markedDates, onMonthChange }) {

  const renderItem = useCallback(({ item, index }) => {
    return <AgendaItem item={item} />
  }, []);

  const calendarRef = useRef(null);
  const rotation = useRef(new Animated.Value(0));

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
          <Text style={styles.headerTitle}>{date?.toString('MMMM yyyy')}</Text>
          <Animated.Image source={CHEVRON} style={{ transform: [{ rotate: '90deg' }, { rotate: rotationInDegrees }] }} />
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

  return (
    <CalendarProvider
      date={new Date().toISOString().split('T')[0]}
      showTodayButton
      onMonthChange={onMonthChange}>
      <ExpandableCalendar
        testID='expandableCalendar'
        renderHeader={renderHeader}
        ref={calendarRef}
        onCalendarToggled={onCalendarToggled}
        // horizontal={false}
        // hideArrows
        // disablePan
        // hideKnob
        // initialPosition={ExpandableCalendar.positions.OPEN}
        // calendarStyle={styles.calendar}
        // headerStyle={styles.header} // for horizontal only
        disableWeekScroll
        // theme={theme.current}
        disableAllTouchEventsForDisabledDays={true}
        firstDay={1}
        markedDates={markedDates}
        leftArrowImageSource={leftArrowIcon}
        rightArrowImageSource={rightArrowIcon}
      // animateScroll
      // closeOnDayPress={false}
      />
      <AgendaList
        testID='agendalist'
        sections={items}
        renderItem={renderItem}
      />
    </CalendarProvider>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    marginRight: 10,
  },
  dayContainer: {
    backgroundColor: '#eee',
    padding: 5,
    marginTop: 10,
  },
  dayText: {
    fontWeight: 'bold',
  },
  calendar: {
    paddingLeft: 20,
    paddingRight: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10
  },
  headerTitle: { fontSize: 16, fontWeight: 'bold', marginRight: 6 },
  section: {
    backgroundColor: '#f2f7f7',
    color: 'grey',
    textTransform: 'capitalize'
  }
});
