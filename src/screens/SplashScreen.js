import React, { useEffect } from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { useAuthStorage } from '../hooks/useAuthStorage'
import { useDispatch } from 'react-redux'
import { setUser } from './../services/authSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { setTime } from '../services/timestamp'

export default function SplashScreen({ navigation }) {
  const { getUser } = useAuthStorage()
  const dispatch = useDispatch()

  useEffect(() => {
    const bootstrap = async () => {
      try {
        // check user login
        const user = await getUser()
        if (user) {
          dispatch(setUser(user))
          navigation.replace('MainDrawer')
        } else {
          navigation.replace('Login')
        }
      } catch (e) {
        console.error('Error loading user:', e)
        navigation.replace('Login')
      }
    }

    bootstrap()
  }, [])

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#b80e0eff" />
      <Text style={styles.text}>กรุณารอซักครู่...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { marginTop: 16, fontSize: 16, color: '#555' }
})
