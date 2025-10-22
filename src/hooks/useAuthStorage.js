import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authStorage } from './../storage/authStorage'

export function useAuthStorage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const storedUser = await getUser();
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (e) {
        console.error('❌ Failed to load user data:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveUser = async (userData) => {
    try {
      await authStorage.saveUser(JSON.stringify(userData));
      setUser(userData);
    } catch (e) {
      console.error('❌ Failed to save user data:', e);
    }
  };

  const getUser = async () => {
    try {
      return await authStorage.getUser();
    } catch (e) {
      console.error('❌ Failed to get user data:', e);
      return null;
    }
  };

  const removeUser = async () => {
    try {
      await authStorage.removeUser();
      setUser(null);
    } catch (e) {
      console.error('❌ Failed to remove user data:', e);
    }
  };

  return { user, loading, saveUser, getUser, removeUser };
}
