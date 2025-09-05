import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { FaEllipsisVertical } from "react-icons/fa6";

import type { Column as ColumnProps } from "../../../lib/columns";
import { useState } from "react";

const Column: React.FC<{ column: ColumnProps }> = ({ column }) => {
  const [isMenuOpen, setOpenMenu] = useState<boolean>(false);

  return (
    <div className="grow bg-gray-200 rounded-md p-4" key={column.id}>
      <div className="flex flex-row justify-between items-center gap-1">
        <h3 className="font-semibold text-gray-900">{column.title}</h3>
        <div className="text-xs border border-gray-300 flex justify-center items-center h-5 w-5 p-0 rounded-sm">
          2
        </div>

        <div className="grow" />
        <div className="relative ">
          <div
            onMouseLeave={() => setOpenMenu(false)}
            className={`flex flex-row bg-gray-300 gap-2 rounded-sm ${
              isMenuOpen
                ? "absolute top-0 right-0 visible block"
                : "invisible hidden"
            }`}
          >
            <button className="flex justify-center items-center transition-colors delay-75 duration-150 ease-in-out bg:transparent hover:bg-indigo-400 hover:text-gray-50 font-medium p-0 h-7 w-7 text-sm rounded-md cursor-pointer ">
              <FaRegEdit />
            </button>

            <button className="flex justify-center items-center transition-colors delay-75 duration-150 ease-in-out bg:transparent hover:bg-red-400 text-red-500 hover:text-gray-50 font-medium p-0 h-7 w-7 text-sm rounded-md cursor-pointer ">
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
    </div>
  );
};

export { Column };
