import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function ExpoSkeleton() {
  const animatedValue = new Animated.Value(0);

  Animated.loop(
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    })
  ).start();

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <View style={styles.card}>
      <View style={{ flex: 1}}>
        <View style={styles.line} />
        <View style={[styles.line, { width: "100%" }]} />
        <Animated.View style={[styles.gradientWrapper, { transform: [{ translateX }] }]}>
          <LinearGradient
            colors={["transparent", "rgba(255,255,255,0.4)", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f6f6f6ff",
    borderRadius: 0,
    marginBottom: 12,
    overflow: "hidden",
  },
  icon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#ccc",
    marginRight: 12,
  },
  line: {
    height: 16,
    backgroundColor: "#e4e4e4ff",
    borderRadius: 4,
    marginBottom: 6,
  },
  gradientWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
});
