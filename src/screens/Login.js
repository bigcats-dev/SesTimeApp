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
import { useDispatch, useSelector } from 'react-redux';
import { loading, loginUser } from '../services/authSlice';

const inputsConfig = [
  { name: 'username', label: 'ชื่อผู้ใช้งาน (Username)' },
  { name: 'password', label: 'รหัสผ่าน (Password)', secure: true },
];

export default function Login({ navigation }) {
  const dispatch = useDispatch();
  const isLoading = useSelector(loading)
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
      const deviceId = await getDeviceId();
      try {
        const payload = { ...form, deviceId };
        const result = await dispatch(loginUser(payload)).unwrap();
        console.log('✅ login success:', result);
        navigation.replace('MainDrawer');
      } catch (err) {
        console.log('❌ login failed:', err);
        Alert.alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
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
            disabled={isLoading}
          >
            <Text style={{ color: '#fff' }}>
              {isLoading ? 'กรุณารอซักครู่...' : 'เข้าใช้งาน'}
            </Text>
          </Button>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
