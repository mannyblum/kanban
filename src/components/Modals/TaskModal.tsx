import { useEffect, useReducer, type FormEvent } from "react";
import type { Task } from "../../../lib/columns";

import classes from "../../components/ProjectBoard/projectboard.module.css";
import { formReducer, initialFormState } from "../../reducers/formReducer";

interface TaskModalProps {
  onClose: () => void;
  onAddTask: (newTask: Task) => void;
  onEditTask: (task: Task) => void;
  task?: Task | null;
}

export default function TaskModal({
  onClose,
  onAddTask,
  onEditTask,
  task,
}: TaskModalProps) {
  const [state, dispatch] = useReducer(formReducer, initialFormState);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (task) {
      onEditTask(task);
    } else {
      onAddTask(state);
    }
  };

  useEffect(() => {
    if (task) {
      dispatch({ type: "SET_TASK", payload: task });
    }
  }, [task]);

  return (
    <dialog className={classes.dialogWrapper}>
      <div className={classes.backdrop} />
      <div className={classes.dialog}>
        <div className={classes.dialogPanel}>
          <div className={classes.dialogPanelContent}>
            <h3 className={classes.dialogTitle}>
              {task ? "Edit" : "Add"} Task
            </h3>
            <form onSubmit={handleSubmit}>
              <div className={classes.formControl}>
                <label htmlFor="taskTitle" className={classes.label}>
                  Title
                </label>
                <input
                  autoFocus
                  type="text"
                  id="taskTitle"
                  name="taskTitle"
                  onChange={(e) =>
                    dispatch({ type: "CHANGE_TITLE", payload: e.target.value })
                  }
                  value={state.title}
                  className={classes.input}
                  placeholder="Enter Task title..."
                />
              </div>
              <div className={classes.formControl}>
                <label htmlFor="taskDescription" className={classes.label}>
                  Description
                </label>
                <textarea
                  rows={5}
                  id="taskDescription"
                  name="taskDescription"
                  onChange={(e) =>
                    dispatch({ type: "CHANGE_DESC", payload: e.target.value })
                  }
                  value={state.description}
                  className={classes.textarea}
                  placeholder="Enter title..."
                />
              </div>
              <div className={classes.formControl}>
                <label htmlFor="assignee" className={classes.label}>
                  Assignee
                </label>
                <input
                  type="text"
                  id="assignee"
                  name="asignee"
                  onChange={(e) =>
                    dispatch({
                      type: "CHANGE_ASSIGNEE",
                      payload: e.target.value,
                    })
                  }
                  value={state.assignee}
                  className={classes.input}
                  placeholder="Enter assignee ..."
                />
              </div>
              <div className={classes.formControl}>
                <label htmlFor="dueDate" className={classes.label}>
                  Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  onChange={(e) =>
                    dispatch({
                      type: "CHANGE_DUEDATE",
                      payload: e.target.value,
                    })
                  }
                  value={state.dueDate}
                  // implement min value
                  // min=""
                  className={classes.input}
                />
              </div>
              <div className={classes.formControl}>
                <label htmlFor="columnTitle" className={classes.label}>
                  Priority
                </label>
                <select
                  name="priority"
                  id="priority"
                  className={classes.select}
                  onChange={(e) =>
                    dispatch({
                      type: "CHANGE_PRIORITY",
                      payload: e.target.value,
                    })
                  }
                >
                  <option value=""> Select priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                {/* <input
                  type="text"
                  id="taskPriority"
                  name="taskPriority"
                  onChange={(e) =>
                    dispatch({ type: "CHANGE_TITLE", payload: e.target.value })
                  }
                  value={state.title}
                  className={classes.input}
                  placeholder="Priority ..."
                /> */}
              </div>
              <div className={classes.formControl}>
                <label htmlFor="columnTitle" className={classes.label}>
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  id="taskTags"
                  name="taskTags"
                  onChange={(e) =>
                    dispatch({ type: "CHANGE_TAGS", payload: e.target.value })
                  }
                  value={state.tags}
                  className={classes.input}
                  placeholder="Enter tags..."
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
                  disabled={state.title.length === 0}
                  type="submit"
                  className={classes.primary}
                >
                  {task ? "Edit" : "Add"} Task
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </dialog>
  );
}
