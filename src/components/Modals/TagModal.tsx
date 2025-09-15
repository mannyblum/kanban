import classes from "../../components/ProjectBoard/projectboard.module.css";

import type { Tag } from "../../../lib/tags";
import { useState, type ChangeEvent, type FormEvent } from "react";

interface TagsModalProps {
  onClose: () => void;
  onAddTag: (tagName: string) => void;
  onEditTag: (tag: Tag) => void;
  tag?: Tag | null;
}

export default function UserModal({
  onAddTag,
  onEditTag,
  tag,
  onClose,
}: TagsModalProps) {
  const [tagName, setTagName] = useState<string>("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTagName(event.target?.value);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (tag) {
      const newTag: Tag = {
        ...tag,
        name: tagName,
      };

      onEditTag(newTag);
    } else {
      onAddTag(tagName);
    }
  };
  return (
    <dialog className={classes.dialogWrapper}>
      <div className={classes.backdrop} />
      <div className={classes.dialog}>
        <div className={classes.dialogPanel}>
          <div className={classes.dialogPanelContent}>
            <h3 className={classes.dialogTitle}>
              {tag ? "Edit" : "Add New"} Tag
            </h3>
            <form onSubmit={onSubmit}>
              <div className={classes.formControl}>
                <label htmlFor="tagName" className={classes.label}>
                  Tag Name
                </label>
                <input
                  autoFocus
                  type="text"
                  id="tagName"
                  name="tagName"
                  onChange={handleChange}
                  value={tagName}
                  className={classes.input}
                  placeholder="Enter Tag"
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
                  disabled={tagName.length === 0}
                  type="submit"
                  className={classes.primary}
                >
                  {tag ? "Edit" : "Add"} Tag
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </dialog>
  );
}
