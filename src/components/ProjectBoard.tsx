import { useRef, useState } from "react";
import classes from "./projectboard.module.css";
import { createPortal } from "react-dom";

export function ColumnModal() {
  return (
    <dialog className={classes.dialogWrapper}>
      <div className={classes.backdrop} />
      <div className={classes.dialog}>
        <div className={classes.dialogPanel}>
          <div className={classes.dialogPanelContent}>
            <h3 className={classes.dialogTitle}>Add New Column</h3>
            <form>
              <div className={classes.formControl}>
                <label htmlFor="columnTitle" className={classes.label}>
                  Column Title
                </label>
                <input
                  type="text"
                  id="columnTitle"
                  name="columnTitle"
                  className={classes.input}
                  placeholder="Enter column title..."
                />
              </div>
            </form>
            <div className={classes.dialogFooter}>
              <button className={classes.cancel}>Cancel</button>
              <button className={classes.primary}>Create Column</button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export default function ProjectBoard() {
  const [showAddColumnModal, setAddColumnModal] = useState<boolean>(true);

  const portalRef = useRef<HTMLDivElement>(null);

  const handleAddColumn = () => {
    console.log("showAddColumnModal", showAddColumnModal);
    console.log("portalRef", portalRef);
    setAddColumnModal(true);
  };

  return (
    <section ref={portalRef}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-slate-900 font-semibold">Project Board</h2>
        <button onClick={handleAddColumn} className={classes.button}>
          <span>+</span>
          <span>Add Column</span>
        </button>
      </div>
      {showAddColumnModal &&
        portalRef.current &&
        createPortal(<ColumnModal />, portalRef.current)}
    </section>
  );
}
