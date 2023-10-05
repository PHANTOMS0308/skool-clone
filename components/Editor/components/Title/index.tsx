import TextField from "@mui/material/TextField";
import { useData, useDataDispatch } from "../../providers/DataProvider";
import React from "react";

export default function EditorTitle() {
  const { title } = useData();
  const dispatch = useDataDispatch();

  if (title === undefined) return null;

  return (
    <TextField
      type="text"
      fullWidth={true}
      placeholder="Title"
      value={title}
      variant="standard"
      InputProps={{
        disableUnderline: true,
        style: {
          fontSize: "23px",
          fontWeight: "bold",
          marginBottom: "8px",
        },
      }}
      onChange={(e) => dispatch({ type: "SET_TITLE", payload: e.target.value })}
    />
  );
}
