import React, { useState } from 'react';
import {
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import styles from '../styles/style';
import { isEmptyString } from '../utils';
import Error from '../components/Error';
import { useAuthStorage } from '../hooks/useAuthStorage';
import { getDeviceId } from '../hooks/useDeviceId';

const mockUser = {
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NjA0MDg3MjUsImp0aSI6IjE3NjA0MDg3MjU2OGVkYjQ5NWIzNDc0IiwibmJmIjoxNzYwNDA4NzM1LCJleHAiOjE3NjA0MTIzMzUsImRhdGEiOnsidXNlcklkIjoiMjY0IiwidXNlck5hbWUiOiJ0ZXN0In19.457yulLsHYk6M_T74IWH-wUTdUi9p1AIyPmcq3KXKCw",
  "data": {
    "userid": "264",
    "user_code": "EMP0001",
    "username": "test",
    "first_name": "นายตรีภพ",
    "last_name": "แก้วสีทา",
    "position": "พนักงานรับแจ้ง",
    "my_location": {
      "latitude": "15.2843305000",
      "longitude": "101.5771914000",
      "datetime": "2025-10-07 17:14:16"
    }
  }
};

const inputsConfig = [
  { name: 'username', label: 'ชื่อผู้ใช้งาน (Username)' },
  { name: 'password', label: 'รหัสผ่าน (Password)', secure: true },
];

export default function Login({ navigation }) {
  const { saveUser } = useAuthStorage()
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({ username: '', password: '' });

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));

    const message =
      name === 'username'
        ? 'กรุณากรอกชื่อผู้ใช้งาน (Username)'
        : 'กรุณากรอกรหัสผ่าน (Password)';

    setErrors((prev) => ({ ...prev, [name]: isEmptyString(value) ? message : '' }));
  };

  const handleLogin = async () => {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      if (isEmptyString(form[key])) {
        newErrors[key] =
          key === 'username'
            ? 'กรุณากรอกชื่อผู้ใช้งาน (Username)'
            : 'กรุณากรอกรหัสผ่าน (Password)';
      }
    });

    setErrors(newErrors);

    if (Object.values(newErrors).every((err) => isEmptyString(err))) {
      // ✅ logic login
      console.log('Login success:', form);
      const deviceId = await getDeviceId();
      await saveUser({ ...mockUser, data: { ...mockUser.data, deviceId } })
      navigation.replace('MainDrawer')
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.containerLogin}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/splash-icon.png')}
              style={styles.logo}
            />
            <Text style={styles.titleLogin}>Siam Express Survey</Text>
          </View>

          {inputsConfig.map(({ name, label, secure }) => (
            <View key={name} style={styles.inputWrapper}>
              <TextInput
                label={label}
                value={form[name]}
                onChangeText={(text) => handleChange(name, text)}
                secureTextEntry={secure}
                style={styles.inputLog}
                mode="outlined"
                outlineColor="#ff3b30"
                activeOutlineColor="#ff3b30"
                textColor="#000"
                contentStyle={{ paddingVertical: 8 }}
                labelStyle={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}
              />
              {!isEmptyString(errors[name]) && <Error message={errors[name]} />}
            </View>
          ))}

          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.buttonLog}
            labelStyle={styles.labelStyleLog}
            contentStyle={{ paddingVertical: 8 }}
          >
            เข้าใช้งาน
          </Button>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
