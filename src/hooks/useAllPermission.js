// hooks/useAllPermissions.js
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";

export default function useAllPermissions() {
  const [granted, setGranted] = useState(false);
  const [loading, setLoading] = useState(false);

  const requestAll = async () => {
    setLoading(true);

    try {
      const results = {};
      // 📸 Camera
      results.camera = await ImagePicker.requestCameraPermissionsAsync();
      // 🖼 Media Library / Gallery
      results.mediaLibrary = await ImagePicker.requestMediaLibraryPermissionsAsync();
      // 📍 Location (foreground)
      results.location = await Location.requestForegroundPermissionsAsync();
      // 🔔 Notifications permission
      results.notifications = await Notifications.requestPermissionsAsync();
      if (__DEV__) console.log('all gradted', results)

      const allGranted = Object.values(results).every(
        (res) => res.status === "granted" || res.granted === true
      );
      if (__DEV__) {
        console.log('allGranted', allGranted)
      }
      setGranted(allGranted);
      return {
        granted: allGranted,
        details: results,
      };
    } catch (error) {
      return {
        granted: false,
        error,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    requestAll,
    granted,
    loading,
  };
}
