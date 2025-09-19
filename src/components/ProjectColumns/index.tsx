import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { FaEllipsisVertical } from "react-icons/fa6";

import type { Column as ColumnProps, Task } from "../../../lib/columns";
import { memo, useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import TaskModal from "../Modals/TaskModal";

import {
  addTask,
  deleteTask,
  getTasksByColumnId,
  updateTask,
} from "../../../lib/tasks";

import { useNotifications } from "../../hooks/useNotifications";
import type { Notification } from "../../context/notifications";
import ProjectCard from "../ProjectCards";
import useConfirm from "../../hooks/useConfirm";
import { createPortal } from "react-dom";
import { getTags, type Tag } from "../../../lib/tags";
import { getUsers, type User } from "../../../lib/users";

interface ColumnPropsPlus {
  column: ColumnProps;
  onEdit: (column: ColumnProps) => void;
  onDelete: (column: ColumnProps) => void;
}

const Column = memo(({ column, onEdit, onDelete }: ColumnPropsPlus) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isMenuOpen, setOpenMenu] = useState<boolean>(false);
  const [taskModalOpen, setTaskModalOpen] = useState<boolean>(false);

  const [isEditing, setEditing] = useState<boolean>(false);
  const [isDeleting, setDeleting] = useState<boolean>(false);

  const ref = useRef<HTMLDivElement>(null!);

  const { addNotification } = useNotifications();

  useOnClickOutside(ref, () => setOpenMenu(false));

  useEffect(() => {
    const gTasks = async () => {
      const tasks = await getTasksByColumnId(column.id);

      setTasks(tasks);
    };
    const gUsers = async () => {
      const users = await getUsers();

      setUsers(users);
    };
    const gTags = async () => {
      const tags = await getTags();

      setTags(tags);
    };

    gTasks();
    gUsers();
    gTags();
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

  const removeTask = (task: Task) => {
    if (task) {
      setActiveTask(task);
      setDeleting(true);
    }
  };

  useEffect(() => {
    if (activeTask && isEditing) {
      openTaskModal();
    }

    if (activeTask && isDeleting) {
      handleDeleteTask(activeTask);
    }
  }, [activeTask, isEditing, isDeleting]);

  const { ConfirmDeleteDialog, confirm } = useConfirm(
    "Remove Task",
    "Are you sure you want to delete this Task?"
  );

  const handleDeleteTask = async (task: Task) => {
    const answer = await confirm();

    if (answer) {
      const response = await deleteTask(task.id);

      if (response) {
        setTasks((prevTasks) => prevTasks?.filter((t) => task.id !== t.id));

        const noti: Notification = {
          id: response.id,
          message: "Successfully deleted Task",
          severity: "success",
        };

        addNotification(noti);
      } else {
        const noti: Notification = {
          id: new Date().getTime(),
          message: "Something went wrong",
          severity: "error",
        };

        addNotification(noti);
      }
    }

    setDeleting(false);
    setActiveTask(null);
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
              onDelete={removeTask}
              task={task}
              key={task.id}
            />
          ))}
        {users && users.length === 0 && (
          <div className="text-sm bg-yellow-400 border-yellow-700/50 text-yellow-900 py-2 px-4 rounded-lg mb-4 shadow-slate-800 border-2">
            There are no users in this project. Start by adding some users.
          </div>
        )}
        {tags && tags.length === 0 && (
          <div className="text-sm bg-yellow-400 border-yellow-700/50 text-yellow-900 py-2 px-4 rounded-lg mb-4 shadow-slate-800 border-2">
            There are no tags in this project. Start by adding some tags.
          </div>
        )}
        {(users && users.length === 0) ||
          (tags && tags.length === 0) ||
          (tasks && tasks.length === 0 && (
            <div className="text-sm bg-yellow-400 border-yellow-700/50 text-yellow-900 py-2 px-4 rounded-lg mb-4 shadow-slate-800 border-2">
              There are no tasks on this board. Start by adding a task below.
            </div>
          ))}
      </div>
      <div className="">
        <button
          onClick={() => {
            setActiveTask(null);
            openTaskModal();
          }}
          disabled={
            (users && users.length === 0) || (tags && tags.length === 0)
          }
          className="bg-transparent hover:bg-white disabled:bg-gray-500 disabled:text-gray-400 disabled:hover:bg-gray-500 cursor-pointer disabled:cursor-not-allowed border-dotted disabled:border-solid border-2 w-full py-2 rounded-md mt-4 text-sm border-slate-300 hover:border-slate-500 text-slate-500 flex justify-center items-center"
        >
          + Add Task
        </button>
      </div>
      {taskModalOpen &&
        ref.current &&
        createPortal(
          <TaskModal
            task={activeTask}
            onClose={closeTaskModal}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
          />,
          ref.current
        )}
      {isDeleting && <ConfirmDeleteDialog />}
    </div>
  );
});

export { Column };
