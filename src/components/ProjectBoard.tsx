import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import classes from "./projectboard.module.css";
import { createPortal } from "react-dom";
import {
  addColumn,
  getColumns,
  updateColumn,
  deleteColumn,
  type Column,
} from "../../lib/columns";
import { useNotifications } from "../hooks/useNotifications";

import type { Notification } from "../context/notifications";
import { Column as ProjectColumn } from "./ProjectColumns";
import useConfirm from "../hooks/useConfirm";

interface ColumnModalProps {
  onClose: () => void;
  onAddColumn: (columnName: string) => void;
  onEditColumn: (column: Column) => void;
  column?: Column | null;
}

export function ColumnModal({
  onClose,
  onAddColumn,
  onEditColumn,
  column,
}: ColumnModalProps) {
  const [columnName, setColumnName] = useState<string>("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setColumnName(event.target?.value);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (column) {
      const newColumn: Column = {
        ...column,
        title: columnName,
      };

      onEditColumn(newColumn);
    } else {
      onAddColumn(columnName);
    }
  };

  useEffect(() => {
    if (column) {
      setColumnName(column.title);
    }
  }, [column]);

  return (
    <dialog className={classes.dialogWrapper}>
      <div className={classes.backdrop} />
      <div className={classes.dialog}>
        <div className={classes.dialogPanel}>
          <div className={classes.dialogPanelContent}>
            <h3 className={classes.dialogTitle}>
              {column ? "Edit" : "Add New"} Column
            </h3>
            <form onSubmit={onSubmit}>
              <div className={classes.formControl}>
                <label htmlFor="columnTitle" className={classes.label}>
                  Column Title
                </label>
                <input
                  type="text"
                  id="columnTitle"
                  name="columnTitle"
                  onChange={handleChange}
                  value={columnName}
                  className={classes.input}
                  placeholder="Enter column title..."
                />
              </div>
              <div className={classes.dialogFooter}>
                <button
                  type="button"
                  onClick={onClose}
                  className={classes.cancel}
                >
                  Cancel
                </button>
                <button type="submit" className={classes.primary}>
                  {column ? "Edit" : "Add"} Column
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export default function ProjectBoard() {
  const [showColumnModal, setShowColumnModal] = useState<boolean>(false);
  const [columns, setColumns] = useState<Column[]>();

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
    const response = await addColumn({
      id: new Date().getTime(),
      title: columnName,
      order: 0,
    });

    if (response) {
      const noti: Notification = {
        id: response.id,
        message: `Successfully added ${response.title} to the board`,
        severity: "info",
      };

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
      <div className="flex gap-4">
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
