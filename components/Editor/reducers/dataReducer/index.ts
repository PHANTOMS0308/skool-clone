import { EditorData, Attachment, Poll } from "../../types";
import { v4 as getId } from "uuid";

// Supported Action type and corresponding payload
export type Action =
  | { type: "SET_TITLE"; payload: string }
  | { type: "SET_CATEGORY"; payload: string }
  | { type: "INIT_POLL"; payload: Poll[] }
  | { type: "ADD_POLL"; payload: Poll }
  | { type: "SET_POLL"; payload: { _id: string; option: string } }
  | { type: "REMOVE_POLL"; payload: string }
  | { type: "REMOVE_ALL_POLL" }
  | { type: "ADD_ATTACHMENT"; payload: Attachment }
  | { type: "REMOVE_ATTACHMENT"; payload: string }
  | {
      type: "SET_ATTACHMENT";
      payload: { _id: string; attachment: Partial<Attachment> };
    };

export default function dataReducer(
  state: EditorData,
  action: Action
): EditorData {
  switch (action.type) {
    case "SET_TITLE":
      // Updates the title if it exists in the current state.
      if (state.title === undefined) return state;
      return { ...state, title: action.payload };

    case "SET_CATEGORY":
      // Sets the chosen status of the specified category.
      if (state.categories === undefined) return state;
      return {
        ...state,
        categories: state.categories.map((category) => {
          return { ...category, chosen: category.name === action.payload };
        }),
      };

    case "INIT_POLL":
      // Initializes polls if not already present.
      if (state.polls) return state;
      return {
        ...state,
        polls: action.payload,
      };

    case "ADD_POLL":
      // Adds a new poll, ensuring not to exceed the limit of 10.
      if (state.polls === undefined || state.polls.length === 10) return state;
      return {
        ...state,
        polls: [...state.polls, action.payload],
      };

    case "SET_POLL":
      // Updates the option of a specific poll by its ID.
      if (state.polls === undefined) return state;
      return {
        ...state,
        polls: state.polls.map((poll) => {
          if (poll._id === action.payload._id) {
            return { ...poll, option: action.payload.option };
          }
          return poll;
        }),
      };

    case "REMOVE_POLL":
      // Removes a poll by its ID, should have at least 2 options
      if (state.polls === undefined || state.polls.length === 2) return state;
      return {
        ...state,
        polls: state.polls.filter((poll) => poll._id !== action.payload),
      };

    case "REMOVE_ALL_POLL":
      // Removes all polls from the state.
      if (state.polls === undefined) return state;
      const { polls, ...restOfState } = state;
      return restOfState;

    case "ADD_ATTACHMENT":
      // Adds a new attachment to the list.
      return {
        ...state,
        attachments: [...(state.attachments ?? []), action.payload],
      };

    case "REMOVE_ATTACHMENT":
      // Removes an attachment by its ID.
      if (state.attachments === undefined) return state;

      if (state.attachments.length > 1) {
        return {
          ...state,
          attachments: state.attachments.filter(
            (attachment) => attachment._id !== action.payload
          ),
        };
      } else {
        // Remove attachment property from state if there is no attachment
        const { attachments, ...restOfState } = state;
        return restOfState;
      }

    case "SET_ATTACHMENT":
      // Set an attachment by its ID.
      if (state.attachments === undefined) return state;

      return {
        ...state,
        attachments: state.attachments.map((attachment) => {
          if (attachment._id !== action.payload._id) return attachment;
          return { ...attachment, ...action.payload.attachment };
        }),
      };

    default:
      // Handles unexpected actions.
      return state;
  }
}

// some action functions for reusability
export function initPollAction(): Action {
  return {
    type: "INIT_POLL",
    payload: [
      { _id: getId(), option: "", votes: [] },
      { _id: getId(), option: "", votes: [] },
      { _id: getId(), option: "", votes: [] },
    ],
  };
}

export function addPollAction(): Action {
  return {
    type: "ADD_POLL",
    payload: { _id: getId(), option: "", votes: [] },
  };
}
