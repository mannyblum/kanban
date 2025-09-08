const DB_NAME = "kaosBanDB";
const DB_VERSION = 1;

export const Stores = {
  Columns: "columns",
  Tasks: "tasks",
} as const;

let db: IDBDatabase;

export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(Stores.Columns)) {
        db.createObjectStore(Stores.Columns, { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains(Stores.Tasks)) {
        db.createObjectStore(Stores.Tasks, { keyPath: "id" });
      }
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onerror = () => reject(request.error);
  });
}
