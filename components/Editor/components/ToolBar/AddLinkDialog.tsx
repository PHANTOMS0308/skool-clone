import React, { useState } from "react";
import Dialog from "../Dialog";
import TextField from "@mui/material/TextField";

import { validateURL } from "../../utils";

export type AddLinkDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function AddLinkDialog({ open, onClose }: AddLinkDialogProps) {
  const [prompt, setPrompt] = useState("");
  const [isError, setIsError] = useState(false);

  function handleClose() {
    onClose();
    setIsError(false);
  }

  function handleSubmit() {
    const isPromptValid = validateURL(prompt);

    if (isPromptValid) {
      // do something about add link to the content
      console.log(prompt);
      onClose();
    } else {
      setIsError(true);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setIsError(false);
    setPrompt(e.target.value);
  }

  return (
    <Dialog
      open={open}
      title="Add Link"
      submitButtonText="Link"
      onSubmit={handleSubmit}
      onClose={handleClose}
    >
      <TextField
        autoFocus
        error={isError}
        helperText={isError ? "Please input a valid link." : undefined}
        label="Enter a URL"
        type="text"
        fullWidth
        variant="outlined"
        onChange={handleChange}
      />
    </Dialog>
  );
}
