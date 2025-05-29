import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';

const NotificationSettingsScreen = () => {
  const [settings, setSettings] = useState({
    promotions: true,
    orderUpdates: true,
    reminders: false,
    securityAlerts: true,
  });

  const toggleSwitch = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cài đặt thông báo</Text>

      <View style={styles.item}>
        <Text style={styles.label}>Khuyến mãi</Text>
        <Switch
          value={settings.promotions}
          onValueChange={() => toggleSwitch('promotions')}
        />
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Cập nhật đơn hàng</Text>
        <Switch
          value={settings.orderUpdates}
          onValueChange={() => toggleSwitch('orderUpdates')}
        />
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Nhắc nhở đặt xe</Text>
        <Switch
          value={settings.reminders}
          onValueChange={() => toggleSwitch('reminders')}
        />
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Thông báo bảo mật</Text>
        <Switch
          value={settings.securityAlerts}
          onValueChange={() => toggleSwitch('securityAlerts')}
        />
      </View>
    </ScrollView>
  );
};

export default NotificationSettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  label: {
    fontSize: 16,
  },
});
