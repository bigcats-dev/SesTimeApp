import * as Application from 'expo-application';
import { Platform } from 'react-native';

export async function getDeviceId() {
  try {
    if (Platform.OS === 'android') {
      return Application.getAndroidId() || 'unknown-android';
    } else if (Platform.OS === 'ios' && Application.getIosIdForVendorAsync) {
      return (await Application.getIosIdForVendorAsync()) || 'unknown-ios';
    } else {
      return `${Platform.OS}-unknown`;
    }
  } catch (error) {
    console.warn('Error fetching device ID:', error);
    return 'error-fetching-id';
  }
}