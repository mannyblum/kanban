import { useContext } from "react";
import {
  NotificationsContext,
  type Notification,
} from "../context/notifications";

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);

  if (!ctx) {
    throw new Error(
      "useNotifications must be used withing a NotificationsProvider"
    );
  }

  const { addNotification } = ctx;

  const addNoti = (notification: Notification) => {
    console.log("notification", notification);
    addNotification(notification);
  };

  const clearNotification = () => {
    return;
  };

  return {
    addNotification: addNoti,
    clearNotification,
  };
};
