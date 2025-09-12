import { initDB, Stores } from "./db";

export type User = {
  id: number;
  name: string;
};

export async function addUser(user: User): Promise<User> {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(Stores.Users, "readwrite");
    const store = tx.objectStore(Stores.Users);

    const request = store.add(user);

    request.onsuccess = () => resolve(user);
    request.onerror = () => reject(request.error);
  });
}

export async function updateUser(user: User): Promise<User> {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(Stores.Users, "readwrite");
    const store = tx.objectStore(Stores.Users);

    const request = store.put(user);

    request.onsuccess = () => resolve(user);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteUser(id: number): Promise<{ id: number }> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(Stores.Users, "readwrite");
    const store = tx.objectStore(Stores.Users);

    const request = store.delete(id);

    request.onsuccess = () => resolve({ id });
    request.onerror = () => reject(request.error);
  });
}

export async function getUsers(): Promise<User[]> {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(Stores.Users, "readwrite");
    const store = tx.objectStore(Stores.Users);

    const request = store.getAll();

    request.onsuccess = (event: Event) => {
      const db = (event.target as IDBRequest).result;

      return resolve(db);
    };
    request.onerror = () => reject(request.error);
  });
}
