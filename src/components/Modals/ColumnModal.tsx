import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

import classes from "../../components/ProjectBoard/projectboard.module.css";

import { type Column } from "../../../lib/columns";

interface ColumnModalProps {
  onClose: () => void;
  onAddColumn: (columnName: string) => void;
  onEditColumn: (column: Column) => void;
  column?: Column | null;
}

export default function ColumnModal({
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
                  autoFocus
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
