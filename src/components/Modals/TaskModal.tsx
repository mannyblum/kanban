import { useEffect, useReducer, useState, type FormEvent } from "react";
import Select from "react-select";
import type { Task } from "../../../lib/columns";

import classes from "../../components/ProjectBoard/projectboard.module.css";
import { formReducer, initialFormState } from "../../reducers/formReducer";
import { getUsers, type User } from "../../../lib/users";
import useAutoComplete from "../../hooks/useAutoComplete";
import { getTags, type Tag } from "../../../lib/tags";

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

  const [users, setUsers] = useState<User[] | null>(null);
  const [tags, setTags] = useState<Tag[] | null>(null);

  const {
    bindInput,
    bindOptions,
    bindOption,
    isBusy,
    suggestions,
    selectedIndex,
  } = useAutoComplete({
    onChange: (value: User) => {
      dispatch({
        type: "CHANGE_ASSIGNEE",
        payload: value.name,
      });
    },
    source: (search: string) =>
      users?.filter((user) => new RegExp(`^${search}`, "i").test(user.name)),
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (task) {
      onEditTask(task);
    } else {
      onAddTask(state);
    }
  };

  useEffect(() => {
    const gUsers = async () => {
      const users = await getUsers();

      setUsers(users);
    };

    gUsers();
  }, []);

  useEffect(() => {
    const gTags = async () => {
      const tags = await getTags();

      setTags(tags);
    };

    gTags();
  }, []);

  useEffect(() => {
    if (task) {
      dispatch({ type: "SET_TASK", payload: task });
    }
  }, [task]);

  const today = new Date();

  const todayFormatted = today.toISOString().split("T")[0];

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
                  {...bindInput}
                  className={classes.input}
                  placeholder="Enter assignee ..."
                />
                {suggestions.length > 0 && (
                  <ul
                    {...bindOptions}
                    className=" absolute top-15 right-0 left-0 w-full scroll-smooth max-h-[260px] overflow-x-hidden overflow-y-auto border border-gray-300 text-xs  z-10 shadow-md bg-white rounded-md"
                  >
                    {suggestions.map((_, index) => (
                      <li
                        key={index}
                        {...bindOption}
                        className={`cursor-pointer hover:bg-indigo-400 hover:text-white px-3 py-2`}
                      >
                        <div className="">{suggestions[index].name}</div>
                      </li>
                    ))}
                  </ul>
                )}
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
                  min={todayFormatted.replace(/\//g, "-")}
                  className={classes.input}
                />
              </div>
              <div className={classes.formControl}>
                <label htmlFor="priority" className={classes.label}>
                  Priority
                </label>
                <select
                  name="priority"
                  id="priority"
                  value={state.priority}
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
              </div>
              <div className={classes.formControl}>
                <label htmlFor="taskTags" className={classes.label}>
                  Tags (comma separated)
                </label>
                <Select
                  options={tags!}
                  isMulti
                  name="tags"
                  id="tags"
                  value={state.tags}
                  onChange={(option) =>
                    dispatch({ type: "CHANGE_TAGS", payload: option })
                  }
                  styles={{
                    control: (baseStyles) => ({
                      ...baseStyles,
                      borderColor: "var(--color-gray-300)",
                    }),
                    placeholder: (baseStyles) => ({
                      ...baseStyles,
                      fontSize: "var(--text-xs)",
                      color: "var(--color-gray-500)",
                    }),
                    option: (baseStyles) => ({
                      ...baseStyles,
                      fontSize: "var(--text-xs)",
                      color: "var(--color-gray-500)",
                    }),
                  }}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id.toString()}
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
