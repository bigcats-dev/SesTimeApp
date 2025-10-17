import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useAuthStorage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async () => {
            try {
                const storedUser = await AsyncStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
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
            await AsyncStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
        } catch (e) {
            console.error('❌ Failed to save user data:', e);
        }
    };

    const getUser = async () => {
        try {
            const storedUser = await AsyncStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (e) {
            console.error('❌ Failed to get user data:', e);
            return null;
        }
    };
    
    const removeUser = async () => {
        try {
            await AsyncStorage.removeItem('user');
            setUser(null);
        } catch (e) {
            console.error('❌ Failed to remove user data:', e);
        }
    };

    return { user, loading, saveUser, getUser, removeUser };
}
