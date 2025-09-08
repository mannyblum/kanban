import { useState } from "react";
import classes from "../components/projectboard.module.css";

const useConfirm = (title: string, message: string) => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () =>
    new Promise((resolve) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmDeleteDialog = () => {
    return (
      <dialog className={classes.dialogWrapper}>
        <div className={classes.backdrop} />
        <div className={classes.dialog}>
          <div className={classes.dialogPanel}>
            <div className={classes.dialogPanelContent}>
              <h3 className={classes.dialogTitle}>{title}</h3>
              <div className={classes.dialogContent}>
                <p>{message}</p>
              </div>
              <div className={classes.dialogFooter}>
                <button
                  type="button"
                  onClick={handleCancel}
                  className={classes.cancel}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className={classes.primary}
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    );
  };

  return { ConfirmDeleteDialog, confirm };
};

export default useConfirm;
