import { useEffect, useRef, useState } from "react";
import classes from "./projectboard.module.css";
import { createPortal } from "react-dom";
import {
  addColumn,
  getColumns,
  updateColumn,
  deleteColumn,
  type Column,
} from "../../../lib/columns";

import { useNotifications } from "../../hooks/useNotifications";
import type { Notification } from "../../context/notifications";

import useConfirm from "../../hooks/useConfirm";

import ColumnModal from "../Modals/ColumnModal";
import { Column as ProjectColumn } from "../ProjectColumns";

export default function ProjectBoard() {
  const [showColumnModal, setShowColumnModal] = useState<boolean>(false);
  const [columns, setColumns] = useState<Column[]>([]);

  const [isEditing, setEditing] = useState<boolean>(false);
  const [isDeleting, setDeleting] = useState<boolean>(false);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const { addNotification } = useNotifications();

  const portalRef = useRef<HTMLDivElement>(null);

  const handleShowColumnModal = () => {
    setShowColumnModal(true);
  };

  useEffect(() => {
    const gColumns = async () => {
      const columns = await getColumns();

      setColumns(columns);
    };

    gColumns();
  }, []);

  const handleAddColumn = async (columnName: string) => {
    const newColumn = {
      id: new Date().getTime(),
      title: columnName,
      order: 0,
    };

    const response = await addColumn(newColumn);

    if (response) {
      const noti: Notification = {
        id: response.id,
        message: `Successfully added ${response.title} to the board`,
        severity: "info",
      };

      setColumns([...columns, newColumn]);

      addNotification(noti);
      setShowColumnModal(false);
    }
  };

  const editColumn = (column: Column) => {
    if (column) {
      setActiveColumn(column);
      setEditing(true);
    }
  };

  const removeColumn = (column: Column) => {
    if (column) {
      setActiveColumn(column);
      setDeleting(true);
    }
  };

  const { ConfirmDeleteDialog, confirm } = useConfirm(
    "Remove Column",
    "Are you sure you want to delete this column?"
  );

  useEffect(() => {
    if (activeColumn && isEditing) {
      setShowColumnModal(true);
    }

    if (activeColumn && isDeleting) {
      handleDeleteColumn(activeColumn);
    }
  }, [activeColumn, isEditing, isDeleting]);

  const handleEditColumn = async (newColumn: Column) => {
    if (newColumn) {
      const response = await updateColumn(newColumn);

      if (response) {
        setColumns((prevColumns) =>
          prevColumns?.map((col) => (col.id === response.id ? response : col))
        );

        const noti: Notification = {
          id: response.id,
          message: `Successfully edited Column`,
          severity: "success",
        };

        addNotification(noti);
        setShowColumnModal(false);
        setEditing(false);
      }
    }
  };

  const handleDeleteColumn = async (column: Column) => {
    const answer = await confirm();

    if (answer) {
      const response = await deleteColumn(column.id);

      if (response) {
        setColumns((prevColumns) =>
          prevColumns?.filter((col) => col.id !== column.id)
        );
        const noti: Notification = {
          id: response.id,
          message: "Successfully deleted Column",
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
  };

  const handleClose = () => {
    setShowColumnModal(false);
    setActiveColumn(null);
  };

  if (!columns) return;

  return (
    <section ref={portalRef}>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl text-slate-900 font-semibold">Project Board</h2>
        <button onClick={handleShowColumnModal} className={classes.button}>
          <span>+</span>
          <span>Add Column</span>
        </button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {columns.map((column) => {
          return (
            <ProjectColumn
              key={column.id}
              column={column}
              onEdit={editColumn}
              onDelete={removeColumn}
            />
          );
        })}
      </div>
      {showColumnModal &&
        portalRef.current &&
        createPortal(
          <ColumnModal
            column={activeColumn}
            onClose={handleClose}
            onAddColumn={handleAddColumn}
            onEditColumn={handleEditColumn}
          />,
          portalRef.current
        )}
      {isDeleting && <ConfirmDeleteDialog />}
    </section>
  );
}
