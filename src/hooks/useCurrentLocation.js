// src/hooks/useCurrentLocation.js
import * as Location from 'expo-location';
import { useState } from 'react';

export default function useCurrentLocation() {
    const [state, setState] = useState({ location: null, errorMsg: null, loading: false });

    const getLocation = async () => {
        setState({ location: null, errorMsg: null, loading: true });
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setState({ location: null, errorMsg: 'Permission denied', loading: false });
                return null;
            }
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            setState({ location: loc, errorMsg: null, loading: false });
            return loc;
        } catch (e) {
            setState({ location: null, errorMsg: e.message, loading: false });
            return null;
        }
    };

    return { ...state, getLocation };
}
