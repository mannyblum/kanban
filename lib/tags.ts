import { initDB, Stores } from "./db";

export type Tag = {
  id: number;
  name: string;
};

export async function addTag(tag: Tag): Promise<Tag> {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(Stores.Tags, "readwrite");
    const store = tx.objectStore(Stores.Tags);

    const request = store.add(tag);

    request.onsuccess = () => resolve(tag);
    request.onerror = () => reject(request.error);
  });
}

export async function updateTag(tag: Tag): Promise<Tag> {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(Stores.Tags, "readwrite");
    const store = tx.objectStore(Stores.Tags);

    const request = store.put(tag);

    request.onsuccess = () => resolve(tag);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteTag(id: number): Promise<{ id: number }> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(Stores.Tags, "readwrite");
    const store = tx.objectStore(Stores.Tags);

    const request = store.delete(id);

    request.onsuccess = () => resolve({ id });
    request.onerror = () => reject(request.error);
  });
}

export async function getTags(): Promise<Tag[]> {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(Stores.Tags, "readwrite");
    const store = tx.objectStore(Stores.Tags);

    const request = store.getAll();

    request.onsuccess = (event: Event) => {
      const db = (event.target as IDBRequest).result;

      return resolve(db);
    };
    request.onerror = () => reject(request.error);
  });
}
