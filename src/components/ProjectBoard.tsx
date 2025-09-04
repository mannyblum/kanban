import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import classes from "./projectboard.module.css";
import { createPortal } from "react-dom";
import { addColumn, getColumns, type Column } from "../../lib/columns";
import { useNotifications } from "../hooks/useNotifications";

import type { Notification } from "../context/notifications";

interface ColumnModalProps {
  handleClose: () => void;
  handleAddColumn: (columnName: string) => void;
}
export function ColumnModal({
  handleClose,
  handleAddColumn,
}: ColumnModalProps) {
  const [columnName, setColumnName] = useState<string>("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setColumnName(event.target?.value);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    handleAddColumn(columnName);
  };

  return (
    <dialog className={classes.dialogWrapper}>
      <div className={classes.backdrop} />
      <div className={classes.dialog}>
        <div className={classes.dialogPanel}>
          <div className={classes.dialogPanelContent}>
            <h3 className={classes.dialogTitle}>Add New Column</h3>
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
                  onClick={handleClose}
                  className={classes.cancel}
                >
                  Cancel
                </button>
                <button type="submit" className={classes.primary}>
                  Create Column
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

  const onAddColumn = async (columnName: string) => {
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
    }
  };

  const onClose = () => {
    setShowColumnModal(false);
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
            <div className="grow bg-gray-200 rounded-md p-4" key={column.id}>
              <div className="flex flex-row justify-between items-center">
                <h3 className="font-semibold text-gray-900 mr-2">
                  {column.title}
                </h3>
                <div className="text-xs border border-gray-300 flex justify-center items-center h-5 w-5 p-0 rounded-sm">
                  2
                </div>

                <div className="grow" />
                <button className="transition-colors delay-75 duration-150 ease-in-out bg:transparent hover:bg-indigo-400 hover:text-gray-50 font-medium p-0 h-7 w-7 text-sm rounded-md cursor-pointer ">
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {showColumnModal &&
        portalRef.current &&
        createPortal(
          <ColumnModal handleClose={onClose} handleAddColumn={onAddColumn} />,
          portalRef.current
        )}
    </section>
  );
}
