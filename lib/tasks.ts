import { initDB, Stores } from "./db";
import { type Task } from "./columns";

export async function addTask(task: Task): Promise<Task> {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(Stores.Tasks, "readwrite");
    const store = tx.objectStore(Stores.Tasks);

    const t = { ...task, id: new Date().getTime() };
    const request = store.add(t);

    request.onsuccess = () => resolve(t);
    request.onerror = () => reject(request.error);
  });
}

export async function updateTask(task: Task): Promise<Task> {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(Stores.Tasks, "readwrite");
    const store = tx.objectStore(Stores.Tasks);

    const request = store.put(task);

    request.onsuccess = () => resolve(task);
    request.onerror = () => reject(request.error);
  });
}

export async function getTasksByColumnId(columnId: number): Promise<Task[]> {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(Stores.Tasks, "readwrite");
    const store = tx.objectStore(Stores.Tasks);

    const request = store.getAll();

    request.onsuccess = (event: Event) => {
      const db = (event.target as IDBRequest).result;
      const columnTasks = db.filter((task: Task) => {
        return task.columnId === columnId;
      });

      return resolve(columnTasks);
    };
    request.onerror = () => reject(request.error);
  });
}
