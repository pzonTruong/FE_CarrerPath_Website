import { http } from '@/shared/api/http';

export const notificationApi = {
  getVapidPublicKey: async () => {
    const { data } = await http.get('/notifications/vapid-key');
    return data;
  },
  subscribe: async (subscription: PushSubscription) => {
    const { data } = await http.post('/notifications/subscribe', { subscription });
    return data;
  },
  unsubscribe: async (endpoint?: string) => {
    const { data } = await http.post('/notifications/unsubscribe', { endpoint });
    return data;
  },
  sendTestNotification: async () => {
    const { data } = await http.post('/notifications/test');
    return data;
  }
};
