import { useState, useEffect } from 'react';
import { notificationApi } from '../api/notification.api';
import { toast } from 'sonner';
import { BellOff, Send, CheckCircle2, AlertTriangle } from 'lucide-react';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const StudyReminderCard = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [permissionState, setPermissionState] = useState<NotificationPermission>('default');
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setPermissionState(Notification.permission);
    }
    checkExistingSubscription();
  }, []);

  const checkExistingSubscription = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) {
          const sub = await reg.pushManager.getSubscription();
          setIsEnabled(!!sub);
        }
      } catch (e) {
        console.error('Error checking push subscription:', e);
      }
    }
  };

  const handleToggleReminder = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      toast.error('Trình duyệt của bạn không hỗ trợ Web Push Notifications');
      return;
    }

    setIsLoading(true);
    try {
      if (isEnabled) {
        // Unsubscribe
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) {
          const sub = await reg.pushManager.getSubscription();
          if (sub) {
            await sub.unsubscribe();
            await notificationApi.unsubscribe(sub.endpoint);
          }
        }
        setIsEnabled(false);
        toast.info('Đã tắt thông báo nhắc học');
      } else {
        // Subscribe
        const permission = await Notification.requestPermission();
        setPermissionState(permission);

        if (permission !== 'granted') {
          toast.error('Bạn đã từ chối quyền cấp thông báo trên trình duyệt');
          return;
        }

        // Register SW if not registered
        let reg = await navigator.serviceWorker.getRegistration('/sw.js');
        if (!reg) {
          reg = await navigator.serviceWorker.register('/sw.js');
        }
        await navigator.serviceWorker.ready;

        const { publicKey } = await notificationApi.getVapidPublicKey();
        if (!publicKey) {
          toast.error('VAPID public key chưa được thiết lập ở backend');
          return;
        }

        const convertedKey = urlBase64ToUint8Array(publicKey);
        const subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedKey
        });

        await notificationApi.subscribe(subscription);
        setIsEnabled(true);
        toast.success('Đã bật nhắc học thành công! Cùng giữ chuỗi streak nhé');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi bật thông báo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendTestNotification = async () => {
    setIsTesting(true);
    try {
      const data = await notificationApi.sendTestNotification();
      toast.success(data.message || 'Đã gửi thông báo thử nghiệm thành công!');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Không thể gửi thông báo thử nghiệm');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-md relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -right-12 -top-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/80 pb-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 text-2xl shrink-0 shadow-sm">
            💻
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-lg text-foreground uppercase tracking-tight">
                Nhắc Học Tự Động
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Nhận thông báo đẩy trình duyệt để duy trì chuỗi học tập hàng ngày của bạn.
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <button
          onClick={handleToggleReminder}
          disabled={isLoading || permissionState === 'denied'}
          className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isEnabled ? 'bg-emerald-500' : 'bg-muted border-border'
            } disabled:opacity-50`}
          title={isEnabled ? 'Tắt nhắc học' : 'Bật nhắc học'}
        >
          <span
            className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${isEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
          />
        </button>
      </div>

      {/* Permission & Test Controls */}
      <div className="space-y-4">
        {permissionState === 'denied' && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-500 text-xs font-semibold">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Trình duyệt của bạn đang chặn thông báo. Vui lòng mở cài đặt trình duyệt để cấp quyền.</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-muted/40 p-4 rounded-xl border border-border">
          <div className="flex items-center gap-2">
            {isEnabled ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <BellOff className="w-4 h-4 text-muted-foreground" />
            )}
            <span className="text-xs font-bold text-foreground">
              Trạng thái: {isEnabled ? 'Đã bật thông báo nhắc học' : 'Chưa bật thông báo'}
            </span>
          </div>

          <button
            onClick={handleSendTestNotification}
            disabled={!isEnabled || isTesting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-extrabold text-xs hover:opacity-90 transition shadow-md disabled:opacity-50"
          >
            <Send className={`w-3.5 h-3.5 ${isTesting ? 'animate-bounce' : ''}`} />
            {isTesting ? 'Đang gửi...' : 'Test Gửi Thông Báo Trực Tiếp'}
          </button>
        </div>
      </div>
    </div>
  );
};
