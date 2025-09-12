const DB_NAME = "kaosBanDB";
const DB_VERSION = 2;

export const Stores = {
  Columns: "columns",
  Tasks: "tasks",
  Users: "users",
  Tags: "tags",
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

      if (!db.objectStoreNames.contains(Stores.Users)) {
        db.createObjectStore(Stores.Users, { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains(Stores.Tags)) {
        db.createObjectStore(Stores.Tags, { keyPath: "id" });
      }
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onerror = () => reject(request.error);
  });
}
