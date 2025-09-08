import { initDB, Stores } from "./db";
export interface Column {
  id: number;
  title: string;
  order: number;
}

export interface Task {
  id: number;
  columnId: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: Date;
  priority: "High" | "Medium" | "Low";
  tags: string[];
  order: number;
}

export async function addColumn(column: Column): Promise<Column> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(Stores.Columns, "readwrite");
    const store = tx.objectStore(Stores.Columns);

    const request = store.add(column);

    request.onsuccess = () => resolve(column);
    request.onerror = () => reject(request.error);
  });
}

export async function getColumns(): Promise<Column[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(Stores.Columns, "readonly");
    const store = tx.objectStore(Stores.Columns);

    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function updateColumn(column: Column): Promise<Column> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(Stores.Columns, "readwrite");
    const store = tx.objectStore(Stores.Columns);

    const request = store.put(column);

    request.onsuccess = () => resolve(column);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteColumn(id: number): Promise<{ id: number }> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(Stores.Columns, "readwrite");
    const store = tx.objectStore(Stores.Columns);

    const request = store.delete(id);

    request.onsuccess = () => resolve({ id });
    request.onerror = () => reject(request.error);
  });
}
