import React from 'react';
import { View, Image } from 'react-native';
import { Text, Appbar, TouchableRipple , Card } from 'react-native-paper';
import styles from '../styles/style'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';  

export default function Leave({ navigation }) {
 

  return (
    <View style={{ flex: 1 }}> 
      <Appbar.Header style={styles.appbar}>
        <Appbar.Action
          icon="menu" 
          color="#ff3b30"
          onPress={() => navigation.openDrawer()}
        />
        <Appbar.Content title="การลา" titleStyle={{ textAlign: 'center', color: "white" }} /> 
        <Appbar.Action
          icon="bell"
          color="#ff3b30"
          onPress={() => console.log("กดแจ้งเตือน")}
        />
      </Appbar.Header>

 
      <Card style={{ margin: 16, borderRadius: 16, padding: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image 
            source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
            style={{ width: 60, height: 60, borderRadius: 30, marginRight: 16 }}
          />
          <View>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>สมชาย ใจดี</Text>
            <Text style={{ fontSize: 14, color: 'gray' }}>รหัสพนักงาน: SES00001</Text>
            <Text style={{ fontSize: 14, color: 'gray' }}>ตำแหน่ง: พนักงานเซอร์เวย์</Text>
          </View>
        </View>
      </Card>


 
    </View>
  );
}