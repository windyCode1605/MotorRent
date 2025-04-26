import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
const LoadingScreen = () => (
    <View style={styles.loadingOverlay}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Đang xử lý...</Text>
      </View>
    </View>
  );

  const styles = StyleSheet.create({
      loadingOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
      },
      loadingContainer: {
        backgroundColor: '#333',
        padding: 30,
        borderRadius: 15,
        alignItems: 'center',
      },
      loadingText: {
        color: '#fff',
        marginTop: 10,
        fontSize: 16,
      }

  })
  