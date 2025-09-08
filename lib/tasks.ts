import { initDB, Stores } from "./db";
import { type Task } from "./columns";

export async function addTask(task: Task): Promise<Task> {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(Stores.Tasks, "readwrite");
    const store = tx.objectStore(Stores.Tasks);

    const request = store.add(task);

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

    const columnTasks = request.result.filter((t) => {
      return t.columnId !== columnId;
    });

    request.onsuccess = () => resolve(columnTasks);
    request.onerror = () => reject(request.error);
  });
}
