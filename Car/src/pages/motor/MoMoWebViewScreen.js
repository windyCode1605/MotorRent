import React from 'react';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BASE_URL } from '@env';
console.log("BASE URL MoMoWebViewScreen:", BASE_URL);


const MoMoWebViewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { payUrl } = route.params;

  const handleNavigationChange = (navState) => {
    const url = navState.url;

    if (url.includes('payment-success')) {
      const queryString = url.split('?')[1];
      const params = new URLSearchParams(queryString);
      const orderId = params.get('orderId');
      const resultCode = params.get('resultCode');

      if (resultCode === '0' && orderId) {
        fetch(`${BASE_URL}/payment/update-status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId,
            status: 'success',
          }),
        })
        .then(res => res.json())
        .then(() => {
          navigation.replace('PaymentSuccess');
        })
        .catch(err => {
          console.error("Lỗi khi gọi API:", err);
        });
      }
    }
  };

  return (
    <WebView
      source={{ uri: payUrl }}
      onNavigationStateChange={handleNavigationChange}
      startInLoadingState
    />
  );
};

export default MoMoWebViewScreen;
