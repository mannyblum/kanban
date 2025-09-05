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

export async function deleteColumn(id: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(Stores.Columns, "readwrite");
    const store = tx.objectStore(Stores.Columns);

    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
