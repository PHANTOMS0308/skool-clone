import React, { useState } from "react";
import Dialog from "../Dialog";
import TextField from "@mui/material/TextField";

import { useDataDispatch } from "../../providers/DataProvider";
import { getVideoId } from "../../utils";

import { v4 as getId } from "uuid";

const api = "https://www.googleapis.com/youtube/v3/videos";

export type AddVideoDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function AddVideoDialog({ open, onClose }: AddVideoDialogProps) {
  const [prompt, setPrompt] = useState("");
  const [isError, setIsError] = useState(false);
  const dispatch = useDataDispatch();

  function handleClose() {
    onClose();
    setIsError(false);
  }

  function handleSubmit() {
    const id = getVideoId(prompt);
    const key = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

    if (!id || !key) {
      setIsError(true);
      return;
    }

    const params = new URLSearchParams();
    params.append("part", "snippet");
    params.append("key", key);
    params.append("id", id);

    fetch(api + "?" + params.toString())
      .then((res) => {
        if (!res.ok) {
          throw new Error("Video Link Invalid");
        } else {
          return res.json();
        }
      })
      .then((data) => {
        if (!data.items.length) {
          throw new Error("Video Link Invalid");
        }

        dispatch({
          type: "ADD_ATTACHMENT",
          payload: {
            _id: getId(),
            fileName: data?.items[0].snippet?.title,
            fileType: "video",
            url: `http://www.youtube.com/embed/${id}`,
          },
        });
        onClose();
      })
      .catch((err) => setIsError(true));
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setIsError(false);
    setPrompt(e.target.value);
  }

  return (
    <Dialog
      open={open}
      title="Add Video"
      subTitle="Add a YouTube link."
      submitButtonText="Link"
      onSubmit={handleSubmit}
      onClose={handleClose}
    >
      <TextField
        autoFocus
        error={isError}
        helperText={isError ? "Please input a valid YouTube link." : undefined}
        label="Link"
        type="text"
        fullWidth
        variant="outlined"
        onChange={handleChange}
      />
    </Dialog>
  );
}
