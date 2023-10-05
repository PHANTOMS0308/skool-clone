import React, { Children, useState } from "react";

import Button from "@mui/material/Button";
import DialogContainer from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import styles from "./styles.module.css";

export type DialogProps = {
  title: string;
  subTitle?: string;
  open: boolean;
  onSubmit: () => void;
  onClose: () => void;
  submitButtonText: string;
  children?: React.ReactNode;
};

export default function Dialog(props: DialogProps) {
  const {
    title,
    open,
    onSubmit,
    onClose,
    submitButtonText,
    subTitle,
    children,
  } = props;

  return (
    <DialogContainer
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { padding: "32px", borderRadius: "10px", width: "462px" },
      }}
    >
      <DialogTitle className={styles.title}>{title}</DialogTitle>
      <DialogContent className={styles.content}>
        {subTitle && (
          <DialogContentText className={styles.contentText}>
            {subTitle}
          </DialogContentText>
        )}
        <div className={styles.contentInput}>{children ?? null}</div>
      </DialogContent>
      <DialogActions className={styles.actions}>
        <Button className={styles.cancelButton} onClick={onClose}>
          Cancel
        </Button>
        <Button className={styles.submitButton} onClick={onSubmit}>
          {submitButtonText}
        </Button>
      </DialogActions>
    </DialogContainer>
  );
}
