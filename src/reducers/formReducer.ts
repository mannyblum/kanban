import type { MultiValue } from "react-select";
import type { Task as FormState, Task } from "../../lib/columns";
import type { Tag } from "../../lib/tags";

type FormAction =
  | { type: "CHANGE_TITLE"; payload: string }
  | { type: "CHANGE_DESC"; payload: string }
  | { type: "CHANGE_ASSIGNEE"; payload: string }
  | { type: "CHANGE_DUEDATE"; payload: string }
  | { type: "CHANGE_PRIORITY"; payload: string }
  | { type: "CHANGE_TAGS"; payload: MultiValue<Tag> }
  | { type: "SET_TASK"; payload: Task }
  | { type: "RESET_FORM" };

export const initialFormState: FormState = {
  id: new Date().getTime(),
  columnId: -1,
  title: "",
  description: "",
  assignee: "",
  // dueDate: new Date(),
  dueDate: "",
  tags: [],
  priority: "Low",
};

export const formReducer = (
  state: FormState,
  action: FormAction
): FormState => {
  switch (action.type) {
    case "CHANGE_TITLE":
      return { ...state, title: action.payload };
    case "CHANGE_DESC":
      return { ...state, description: action.payload };
    case "CHANGE_ASSIGNEE":
      return { ...state, assignee: action.payload };
    case "CHANGE_DUEDATE":
      return { ...state, dueDate: action.payload };
    case "CHANGE_PRIORITY":
      return { ...state, priority: action.payload };
    case "CHANGE_TAGS":
      console.log("action.payload", action.payload);
      return { ...state, tags: action.payload };
    case "SET_TASK":
      return { ...action.payload };
    case "RESET_FORM":
      return initialFormState;
    default:
      return state;
  }
};
