import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import KanbanApp from "./KanbanApp.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <KanbanApp />
  </StrictMode>
);
