import { useState } from "react";

import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import { useData, useDataDispatch } from "../../providers/DataProvider";
import { addPollAction } from "../../reducers/dataReducer";
import ConfirmDialog from "../Dialog";

import styles from "./styles.module.css";

export default function PollEditor() {
  const { polls } = useData();
  const dispatch = useDataDispatch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (polls === undefined) return null;

  // Polls are only editable when no votes presented
  const editable = polls.every(({ votes }) => votes.length === 0);

  function handleRemoveAllPoll() {
    if (!polls) return;

    if (polls.every(({ option }) => !option)) {
      dispatch({ type: "REMOVE_ALL_POLL" });
    } else {
      setIsDialogOpen(true);
    }
  }

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <p>Poll</p>
        {editable && (
          <ButtonBase onClick={handleRemoveAllPoll}>Remove</ButtonBase>
        )}
      </header>
      <ul className={styles.pollList}>
        {polls.map(({ _id, option }, index) => (
          <li key={_id} className={styles.pollItem}>
            <TextField
              type="text"
              fullWidth={true}
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) =>
                dispatch({
                  type: "SET_POLL",
                  payload: { _id, option: e.target.value },
                })
              }
              disabled={!editable}
            />
            {editable && (
              <IconButton
                onClick={() => dispatch({ type: "REMOVE_POLL", payload: _id })}
                sx={{ width: "40px", height: "40px" }}
                disabled={polls.length === 2}
              >
                {polls.length > 2 ? <CloseOutlinedIcon /> : null}
              </IconButton>
            )}
          </li>
        ))}
      </ul>
      <footer className={styles.footer}>
        {editable ? (
          <Button
            variant="outlined"
            onClick={() => dispatch(addPollAction())}
            disabled={polls.length === 10}
          >
            ADD OPTION
          </Button>
        ) : (
          <p>You cannot edit or remove a poll that already has votes</p>
        )}
      </footer>
      <ConfirmDialog
        open={isDialogOpen}
        title="Remove poll?"
        subTitle="Are you sure you want to remove this poll"
        onClose={() => setIsDialogOpen(false)}
        submitButtonText="Confirm"
        onSubmit={() => {
          dispatch({ type: "REMOVE_ALL_POLL" });
          setIsDialogOpen(false);
        }}
      />
    </section>
  );
}
