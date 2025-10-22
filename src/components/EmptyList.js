import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function EmptyList({ icon = "file-search-outline", message = "ไม่พบรายการ" }) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={icon} size={60} color="#ccc" style={{ marginBottom: 12 }} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  text: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
});
