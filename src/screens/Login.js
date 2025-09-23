import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import styles from '../styles/style';

export default function Login({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === '' && password === '') {
      navigation.replace('MainDrawer');
    } else {
      alert('Username หรือ Password ไม่ถูกต้อง');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.containerLogin}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.titleLogin}>Siam Express Survey</Text>

      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.inputLog}
        mode="outlined"
        placeholderTextColor="#aaa"
        outlineColor="#ff3b30"
        activeOutlineColor="#ff3b30"
        contentStyle={{ paddingVertical: 8 }}
        labelStyle={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}  
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.inputLog}
        mode="outlined"
        placeholderTextColor="#aaa"
        outlineColor="#ff3b30"
        activeOutlineColor="#ff3b30"
        contentStyle={{ paddingVertical: 8 }}
        labelStyle={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}  
      />

      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.buttonLog}
        labelStyle={styles.labelStyleLog}
        contentStyle={{ paddingVertical: 8 }}
      >
        เข้าใช้งาน
      </Button>
    </KeyboardAvoidingView>
  );
}
