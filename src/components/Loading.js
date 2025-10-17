import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import { Text } from 'react-native-paper';

export default function Loading({ visible = false }) {
    if (!visible) return null;

    return (
        <Modal transparent animationType="fade">
            <View style={styles.overlay}>
                <ActivityIndicator size="large" color="#ff3b30" />
                <Text style={styles.text}>กรุณารอซักครู่...</Text>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
        fontSize: 18,
    }
});
