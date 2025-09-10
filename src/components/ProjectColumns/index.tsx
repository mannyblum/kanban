import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { FaEllipsisVertical } from "react-icons/fa6";

import type { Column as ColumnProps, Task } from "../../../lib/columns";
import { useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import TaskModal from "../Modals/TaskModal";

import { addTask, getTasksByColumnId, updateTask } from "../../../lib/tasks";

import { useNotifications } from "../../hooks/useNotifications";
import type { Notification } from "../../context/notifications";
import ProjectCard from "../ProjectCards";

interface ColumnPropsPlus {
  column: ColumnProps;
  onEdit: (column: ColumnProps) => void;
  onDelete: (column: ColumnProps) => void;
}

const Column = ({ column, onEdit, onDelete }: ColumnPropsPlus) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task>();
  const [isMenuOpen, setOpenMenu] = useState<boolean>(false);
  const [taskModalOpen, setTaskModalOpen] = useState<boolean>(false);

  const [isEditing, setEditing] = useState<boolean>(false);
  const [isDeleting, setDeleting] = useState<boolean>(false);

  console.log("columnId", column.id);
  console.log("tasks", tasks);

  const ref = useRef<HTMLDivElement>(null!);

  const { addNotification } = useNotifications();

  useOnClickOutside(ref, () => setOpenMenu(false));

  useEffect(() => {
    const gTasks = async () => {
      const tasks = await getTasksByColumnId(column.id);

      setTasks(tasks);
    };

    gTasks();
  }, []);

  const openTaskModal = () => {
    setTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setTaskModalOpen(false);
  };

  const handleAddTask = async (task: Task) => {
    const t = { ...task, columnId: column.id, id: new Date().getTime() };
    const response = await addTask(t);

    if (response) {
      const noti: Notification = {
        id: response.id,
        message: `Successfully added ${response.title} to the board`,
        severity: "info",
      };

      setTasks([...tasks, t]);

      addNotification(noti);
      closeTaskModal();
    }
  };

  const editTask = (task: Task) => {
    if (task) {
      setActiveTask(task);
      openTaskModal();
      setEditing(true);
    }
  };

  const deleteTask = () => {
    console.log("delete");
  };

  const handleEditTask = async (task: Task) => {
    const response = await updateTask(task);

    if (response) {
      const noti: Notification = {
        id: response.id,
        message: `Successfully edited Task`,
        severity: "success",
      };

      addNotification(noti);
      closeTaskModal();
      setEditing(false);
    }
  };

  const handleDeleteTask = () => {};

  return (
    <div
      ref={ref}
      className="flex flex-col items-stretch h-full grow bg-gray-200 rounded-md p-4"
      key={column.id}
    >
      <div className="mb-8 flex flex-row justify-between items-center gap-1">
        <h3 className="font-semibold mr-2 text-gray-900">{column.title}</h3>
        {tasks.length > 0 && (
          <div className="text-xs border border-gray-300 flex justify-center items-center h-5 w-5 p-0 rounded-sm">
            {tasks.length}
          </div>
        )}

        <div className="grow" />
        <div className="relative ">
          <div
            className={`flex flex-row bg-gray-300 gap-2 rounded-sm ${
              isMenuOpen
                ? "absolute top-0 right-0 visible block"
                : "invisible hidden"
            }`}
          >
            <button
              onClick={() => onEdit(column)}
              className="flex justify-center items-center transition-colors delay-75 duration-150 ease-in-out bg:transparent hover:bg-indigo-400 hover:text-gray-50 font-medium p-0 h-7 w-7 text-sm rounded-md cursor-pointer "
            >
              <FaRegEdit />
            </button>

            <button
              onClick={() => onDelete(column)}
              className="flex justify-center items-center transition-colors delay-75 duration-150 ease-in-out bg:transparent hover:bg-red-400 text-red-500 hover:text-gray-50 font-medium p-0 h-7 w-7 text-sm rounded-md cursor-pointer "
            >
              <FaRegTrashAlt />
            </button>
          </div>
          <div className="self-end">
            <button
              onClick={() => setOpenMenu(true)}
              className={`flex justify-center items-center  transition-colors delay-75 duration-150 ease-in-out bg:transparent hover:bg-gray-300 hover:text-gray-50 font-medium p-0 h-7 w-7 text-sm rounded-md cursor-pointer
                ${isMenuOpen ? "invisible" : "block visible"}
                `}
            >
              <FaEllipsisVertical />
            </button>
          </div>
        </div>
      </div>
      <div className="grow">
        {tasks.length > 0 &&
          tasks.map((task) => (
            <ProjectCard
              onEdit={editTask}
              onDelete={deleteTask}
              task={task}
              key={task.id}
            />
          ))}
        {/* tasks?.map((task) => {
             return (
               <div key={task.id} className="">
                 {task.title}
               </div>
             );
           })} */}
      </div>
      <div className="">
        <button
          onClick={openTaskModal}
          className="bg-transparent hover:bg-white cursor-pointer border-dotted border-2 w-full py-2 rounded-md mt-4 text-sm border-slate-300 hover:border-slate-500 text-slate-500 flex justify-center items-center"
        >
          + Add Task
        </button>
      </div>
      {taskModalOpen && (
        <TaskModal
          task={activeTask}
          onClose={closeTaskModal}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
        />
      )}
    </div>
  );
};

export { Column };
