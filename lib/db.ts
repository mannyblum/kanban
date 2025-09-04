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

// let request: IDBOpenDBRequest;
// let db: IDBDatabase;
// let version = 1;

// const stores = {
//   columns: "columns",
//   tasks: "tasks",
// } as const;

// export interface User {
//   id: string;
//   name: string;
// }

// export interface Column {
//   id: string;
//   name: string;
// }

// export interface Tag {
//   id: string;
//   name: string;
// }

// export interface Task {
//   id: string;
//   columnId: string;
//   title: string;
//   description: string;
//   assignee: string[] | User[];
//   dueDate: Date;
//   priority: string;
//   tags: Tag[];
// }

// export const initDB = (): Promise<boolean> => {
//   return new Promise((resolve) => {
//     request = indexedDB.open("kaosban");

//     request.onupgradeneeded = () => {
//       db = request.result;

//       if (!db.objectStoreNames.contains(stores.columns)) {
//         console.log("Creating Columns DB");
//         db.createObjectStore(stores.columns, { keyPath: "id" });
//       }

//       if (!db.objectStoreNames.contains(stores.tasks)) {
//         console.log("Creating Tasks DB");
//         db.createObjectStore(stores.tasks, { keyPath: "id" });
//       }
//     };

//     request.onsuccess = () => {
//       console.log("request", request);
//       db = request.result;
//       version = db.version;
//       console.log("request.onsuccess - initDB", version);

//       resolve(true);
//     };

//     request.onerror = () => {
//       resolve(false);
//     };
//   });
// };

// export const addDbColumn = <T>(
//   storeName: string,
//   data: T
// ): Promise<T | string | null> => {
//   return new Promise((resolve) => {
//     request = indexedDB.open("kaosban");

//     request.onsuccess = () => {
//       console.log("store", storeName);
//       console.log("db.storeNames", db.objectStoreNames);
//       console.log("addColumn", data);
//       db = request.result;
//       const tx = db.transaction(["kaosban"], "readwrite");
//       const store = tx.objectStore(storeName);
//       store.add(data);

//       resolve(data);
//     };

//     request.onerror = () => {
//       const error = request.error?.message;
//       if (error) {
//         resolve(error);
//       } else {
//         resolve("Unknown Error");
//       }
//     };
//   });
// };
