import { useAppStore } from '@/stores/app.store';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NotificationList() {
  const notifications = useAppStore((state) => state.notifications);
  const removeNotification = useAppStore((state) => state.removeNotification);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-96 max-w-[calc(100vw-2rem)]">
      {notifications.map((notification) => (
        <Alert
          key={notification.id}
          variant={notification.type === 'error' ? 'destructive' : 'default'}
          className="relative pr-10"
        >
          <AlertTitle>{notification.title}</AlertTitle>
          {notification.message && (
            <AlertDescription>{notification.message}</AlertDescription>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-6 w-6 p-0"
            onClick={() => removeNotification(notification.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </Alert>
      ))}
    </div>
  );
}
