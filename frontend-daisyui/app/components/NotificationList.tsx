import { useAppStore } from '~/stores/app.store';
import { X } from 'lucide-react';

export function NotificationList() {
  const { notifications, removeNotification } = useAppStore();

  if (notifications.length === 0) return null;

  const getAlertClass = (type: string) => {
    switch (type) {
      case 'success':
        return 'alert-success';
      case 'error':
        return 'alert-error';
      case 'warning':
        return 'alert-warning';
      case 'info':
        return 'alert-info';
      default:
        return '';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`alert ${getAlertClass(notification.type)} shadow-lg`}
        >
          <div className="flex-1">
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="btn btn-ghost btn-sm"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}