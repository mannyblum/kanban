import { useState } from "react";
import type { Task } from "../../../lib/columns";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { FaRegCalendar, FaRegUser } from "react-icons/fa6";

type ProjectCardProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

export default function ProjectCard({
  task,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const [showOptions, setShowOptions] = useState<boolean>(true);

  return (
    <div
      key={task.id}
      className="text-sm bg-[#F9FAFB] hover:bg-neutral-50 py-2 px-4 rounded-lg mb-4 shadow-slate-800 border border-slate-800/10"
    >
      <div className="mb-4 flex flex-row justify-between items-center gap-1">
        <h4 className="font-medium">{task.title}</h4>
        {showOptions && (
          <div className="flex flex-row">
            <button
              onClick={() => onEdit(task)}
              className="flex justify-center items-center transition-colors delay-75 duration-150 ease-in-out bg:transparent hover:bg-indigo-400 hover:text-gray-50 font-medium p-0 h-7 w-7 text-sm rounded-md cursor-pointer "
            >
              <FaRegEdit />
            </button>

            <button
              onClick={() => onDelete(task)}
              className="flex justify-center items-center transition-colors delay-75 duration-150 ease-in-out bg:transparent hover:bg-red-400 text-red-500 hover:text-gray-50 font-medium p-0 h-7 w-7 text-sm rounded-md cursor-pointer "
            >
              <FaRegTrashAlt />
            </button>
          </div>
        )}
      </div>
      <p className="font-light tex-sm text-slate-600 mb-8">
        {task.description}
      </p>
      <div className="text-xs  text-slate-500 flex flex-row items-center justify-around">
        {task.assignee && (
          <div className="flex flex-row justify-center items-center">
            <FaRegUser className="mr-2" />
            {task.assignee}
          </div>
        )}
        {task.dueDate && (
          <div className="flex flex-row justify-center items-center mx-auto">
            <FaRegCalendar className="mr-2" />
            {task.dueDate}
          </div>
        )}
        {task.priority && (
          <div className="capitalize bg-teal-400 px-2 py-1 ml-auto rounded-sm">
            {task.priority}
          </div>
        )}
      </div>
    </div>
  );
}
