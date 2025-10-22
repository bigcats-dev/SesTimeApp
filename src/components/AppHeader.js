import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar } from 'react-native-paper';

import styles from './../styles/style';

const AppHeader = ({ title }) => {
  const route = useRoute();
  const navigation = useNavigation();
  const from = route.params?.from || 'drawer';
  return (
    <Appbar.Header style={styles.appbar}>
      {from === 'drawer' ? (
        <Appbar.Action
          icon="menu"
          color="#ff3b30"
          onPress={() => navigation.openDrawer()}
        />
      ) : (
        <Appbar.Action
          icon="arrow-left"
          color="#ff3b30"
          onPress={() => navigation.goBack()}
        />
      )}
      <Appbar.Content
        title={title}
        titleStyle={{ textAlign: 'center', color: 'white' }}
      />
      <Appbar.Action
        icon="bell"
        color="#ff3b30"
        onPress={() => console.log('กดแจ้งเตือน')}
      />
    </Appbar.Header>
  );
}

export default AppHeader;
