import AsyncStorage from '@react-native-async-storage/async-storage';

export const authStorage = {
  async saveUser(user) {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  },
  async getUser() {
    const json = await AsyncStorage.getItem('user');
    return json ? JSON.parse(json) : null;
  },
  async removeUser() {
    await AsyncStorage.removeItem('user');
  },
};
