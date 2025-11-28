import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Modal } from "react-native";
import { Button } from 'react-native-paper';
import { CameraView, useCameraPermissions } from "expo-camera";
import useCurrentLocation from "../hooks/useCurrentLocation";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import Loading from "../components/Loading";
import { getCurrentDatetime } from "../utils";

export default function QrScannerScreen({ navigation, route: { params: { time_work_id, check_type, remark } } }) {
  const { getLocation } = useCurrentLocation();
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }) => {
    try {
      setScanned(true);
      setLoading(true);
      const loc = await getLocation();
      if (!loc) {
        throw new Error('ไม่สามารถดึงตำแหน่งได้');
      }

      const payload = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        datetime: getCurrentDatetime().datetime,
        check_type,
        time_work_id,
        remark
      };
      console.log('Check-in payload:', payload);
      // const response = await fetch('http://192.168.1.44:10601/checkin', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload),
      // });

      // if (!response.ok) {
      //   throw new Error('ไม่สามารถส่งข้อมูลลงเวลาได้');
      // }

      // const json = await response.json();
      // console.log('Check-in response:', json);
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'HistoryStack',
                state: {
                  routes: [
                    {
                      name: 'History'
                    },
                  ],
                },
              },
            ],
          })
        );

      }, 1000);
    } catch (error) {
      console.error('Error during check-in:', error);
      Alert.alert('ข้อผิดพลาด', error.message || 'เกิดข้อผิดพลาดในการลงเวลา');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barCodeScannerSettings={{
          barCodeTypes: ["qr"],
        }}
        facing="back"
      />

      {/* ✨ QR FRAME OVERLAY */}
      <View style={styles.overlay_qr}>
        <View style={styles.frame} />
        <Text style={styles.instruction}>สแกน QR Code ให้อยู่ในกรอบ</Text>
      </View>

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.containerCheckin}>
            <MaterialCommunityIcons name="check-circle" size={60} color="#4caf50" />
            <Text style={styles.textCheckin}>ลงเวลาเข้างานสำเร็จ</Text>
          </View>
        </View>
      </Modal>
      <Loading visible={loading} />
      {scanned && (
        <Button title="สแกนอีกครั้ง" onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    justifyContent: "flex-end",
  },
  textCheckin: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    color: '#333',
  },
  containerCheckin: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay_qr: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  frame: {
    width: 250,
    height: 250,
    borderWidth: 5,
    borderColor: "#ffffffff",
    borderRadius: 12,
    backgroundColor: "transparent",
    zIndex: 2,
  },
  instruction: {
    marginTop: 20,
    fontSize: 18,
    color: "#fff",
    zIndex: 2,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
});
