// components/FileAttachment.js
import React, { useState } from "react";
import { Alert, View, Image } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Button, List, IconButton, MD3Colors } from "react-native-paper";

export default function FileAttachment({ onChange, multiple = false }) {
  const [files, setFiles] = useState([]);


  const isImage = (file) => {
    if (!file.mimeType) return false;
    return file.mimeType.startsWith("image/");
  };

  const pickDocument = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      multiple: false,
    });

    if (res.assets) {
      const newFile = res.assets[0];
      const updated = [...files, newFile];
      setFiles(updated);
      onChange?.(updated);
    }
  };

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 1,
    });

    if (!result.canceled) {
      const newFile = result.assets[0];
      const updated = [...files, newFile];
      setFiles(updated);
      onChange?.(updated);
    }
  };

  const takePhoto = async () => {
    const cam = await ImagePicker.requestCameraPermissionsAsync();
    if (cam.status !== "granted") {
      Alert.alert("ต้องอนุญาตใช้กล้องก่อน");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled) {
      const file = {
        ...result.assets[0],
        mimeType: result.assets[0].mimeType || "image/jpeg",
        name: result.assets[0].fileName || "camera.jpg",
      };
      const updated = [...files, file];
      setFiles(updated);
      onChange?.(updated);
    }
  };

  const removeFile = (index) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onChange?.(updated);
  };


  return (
    <View style={{ width: "100%", gap: 10 }}>
      <Button
        icon="file"
        mode="contained-tonal"
        onPress={pickDocument}
        disabled={multiple ? false : files.length > 0}>
        แนบไฟล์ (PDF, DOC, XLS ฯลฯ)
      </Button>
      <Button
        icon="image"
        mode="contained-tonal"
        onPress={pickImageFromGallery}
        disabled={multiple ? false : files.length > 0}>
        เลือกรูปจาก Gallery
      </Button>
      <Button
        icon="camera"
        mode="contained-tonal"
        onPress={takePhoto}
        disabled={multiple ? false : files.length > 0}>
        ถ่ายรูป
      </Button>
      {files.map((file, index) => (
        <List.Item
          key={index}
          title={file.name || "รูปภาพ"}
          left={() =>
            isImage(file) ? (
              <Image
                source={{ uri: file.uri }}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 6,
                  marginRight: 10,
                }}
              />
            ) : (
              <List.Icon icon="file" />
            )
          }
          right={() => (
            <IconButton
              icon="delete"
              iconColor={MD3Colors.error50}
              onPress={() => removeFile(index)}
            />
          )}
        />
      ))}
    </View>
  );
}
