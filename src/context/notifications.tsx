import { createContext, useEffect, useState, type ReactNode } from "react";

export interface Notification {
  id: number;
  message: string;
  severity: "info" | "success" | "warning" | "error";
  timeout?: number;
  handleDismiss?: (id: number) => void;
}

export interface NotificationsContextType {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  dismissNotification: (notificationId: number) => void;
}

/* TODO: MOVE THIS */

export const classNames = {
  info: "bg-blue-50 text-blue-800",
  success: "bg-green-50 text-green-800",
  warning: "bg-yellow-50 text-yellow-800",
  error: "bg-red-50 text-red-800",
};

const Notification = ({
  id,
  message,
  severity = "info",
  timeout = 5000,
  handleDismiss,
}: Notification) => {
  useEffect(() => {
    if (timeout > 0 && handleDismiss) {
      const timer = setTimeout(() => {
        handleDismiss(id);
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div
      className={`p-2 rounded-lg shadow-md/20 ${
        classNames[severity as keyof typeof classNames]
      }`}
    >
      {message}
    </div>
  );
};

/* END OF MOVE THIS */

export const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

const NotificationsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = ({
    message,
    severity,
    timeout = 5000,
  }: Notification) => {
    const notification: Notification = {
      id: new Date().getTime(),
      message: message,
      severity: severity,
      timeout,
    };

    setNotifications((prev) => [...prev, notification]);
  };

  const dismissNotification = (notificationId: number) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId)
    );
  };

  return (
    <NotificationsContext.Provider
      value={{ notifications, addNotification, dismissNotification }}
    >
      <div className="fixed top-0 left-0 right-0 p-2 flex flex-col gap-2">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            {...notification}
            handleDismiss={() => dismissNotification(notification.id)}
          />
        ))}
      </div>
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsProvider;
