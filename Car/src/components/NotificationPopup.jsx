import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { socketManager } from '../utils/socket';

const NotificationPopup = () => {
  const [notification, setNotification] = useState(null);
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    // Lắng nghe thông báo từ socket
    socketManager.socket?.on('bookingStatusChanged', (data) => {
      setNotification(data);
      showNotification();
    });

    return () => {
      socketManager.socket?.off('bookingStatusChanged');
    };
  }, []);

  const showNotification = () => {
    // Hiển thị notification
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.delay(3000),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true
      })
    ]).start(() => setNotification(null));
  };

  if (!notification) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <Text style={styles.title}>Thông báo mới</Text>
      <Text style={styles.message}>{notification.message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#007AFF',
    padding: 15,
    margin: 10,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  message: {
    color: '#FFF',
  },
});

export default NotificationPopup;
