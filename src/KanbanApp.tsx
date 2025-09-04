import App from "./App";

import { initDB } from "../lib/db";
import { useEffect, useState } from "react";
import NotificationsProvider from "./context/notifications";

export default function KanbanApp() {
  const [, setIsDBReady] = useState<boolean>(false);

  useEffect(() => {
    const handleInitDB = async () => {
      const status = await initDB();

      if (status) {
        setIsDBReady(true);
      }
    };

    handleInitDB();
  }, []);

  return (
    <NotificationsProvider>
      <App />
    </NotificationsProvider>
  );
}
