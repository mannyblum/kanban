import classes from "../../components/ProjectBoard/projectboard.module.css";

import type { User } from "../../../lib/users";
import { useState, type ChangeEvent, type FormEvent } from "react";
import useAutoComplete from "../../hooks/useAutoComplete";

interface UserModalProps {
  onClose: () => void;
  onAddUser: (userName: string) => void;
  onEditUser: (user: User) => void;
  user?: User | null;
}

export default function UserModal({
  onAddUser,
  onEditUser,
  user,
  onClose,
}: UserModalProps) {
  const [userName, setUserName] = useState<string>("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target?.value);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (user) {
      const newUser: User = {
        ...user,
        name: userName,
      };

      onEditUser(newUser);
    } else {
      onAddUser(userName);
    }
  };
  return (
    <dialog className={classes.dialogWrapper}>
      <div className={classes.backdrop} />
      <div className={classes.dialog}>
        <div className={classes.dialogPanel}>
          <div className={classes.dialogPanelContent}>
            <h3 className={classes.dialogTitle}>
              {user ? "Edit" : "Add New"} User
            </h3>
            <form onSubmit={onSubmit}>
              <div className={classes.formControl}>
                <label htmlFor="columnTitle" className={classes.label}>
                  User Name
                </label>
                <input
                  autoFocus
                  type="text"
                  id="userName"
                  name="userName"
                  onChange={handleChange}
                  value={userName}
                  className={classes.input}
                  placeholder="Enter User"
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
                <button
                  disabled={userName.length === 0}
                  type="submit"
                  className={classes.primary}
                >
                  {user ? "Edit" : "Add"} User
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </dialog>
  );
}
