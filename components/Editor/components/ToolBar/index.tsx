// Core Dependency
import React, { useState, useRef } from "react";
import { useData, useDataDispatch } from "../../providers/DataProvider";
import { getDataURL } from "../../utils";
import { initPollAction } from "../../reducers/dataReducer";
import AddLinkDialog from "./AddLinkDialog";
import AddVideoDialog from "./AddVideoDialog";
import Dialog from "../Dialog";
import { AllowedData } from "../../types";
import { v4 as getId } from "uuid";
import GifPicker from "../GifPicker";

// MUI Components
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";

// MUI Icons
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import GifOutlinedIcon from "@mui/icons-material/GifOutlined";

// Custom CSS Styling
import styles from "./styles.module.css";
import { ImageConfig } from "next/dist/shared/lib/image-config";

export type ToolBarProps = {
  allowedData: AllowedData;
};

export default function ToolBar({ allowedData }: ToolBarProps) {
  const data = useData();
  const dispatch = useDataDispatch();

  // To access the <input type='file'>
  const inputRef = useRef<HTMLInputElement | null>(null);

  // To control different Dialog opening states
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false);
  const [isRemovePollOpen, setIsRemovePollOpen] = useState(false);

  // To control different Dropdown opening states
  const [isAddGifOpen, setIsAddGifOpen] = useState(false);

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const { files } = e.target;

    if (!files || !files.length) return;

    if (files[0].size > 1024 * 1024 * 20) {
      alert("File too large, 20mb max");
      return;
    }

    dispatch({
      type: "ADD_ATTACHMENT",
      payload: {
        _id: getId(),
        fileType: "attachment",
        fileName: files[0].name,
        url: getDataURL(files[0]),
      },
    });
  }

  function handleAddPoll(e: React.MouseEvent<HTMLButtonElement>) {
    if (!data.polls) {
      // If no poll, initiate new poll
      dispatch(initPollAction());
    } else if (data.polls.every(({ option }) => !option)) {
      // If poll is empty, remove the poll
      dispatch({ type: "REMOVE_ALL_POLL" });
    } else {
      // If poll is not empy, open the confirm remove dialog
      setIsRemovePollOpen(true);
    }
  }

  // Conditionally rendering toolbar items based on AllowedData
  return (
    <div role="toolbar" className={styles.container}>
      {allowedData.attachments && (
        <label>
          <input
            style={{ display: "none" }}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            ref={inputRef}
          />
          <Tooltip title="Add Attachment" placement="top">
            <IconButton
              sx={{ width: "40px", height: "40px" }}
              onClick={() => inputRef.current?.click()}
            >
              <AttachFileOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </label>
      )}
      {allowedData.content && (
        <Tooltip title="Add Link" placement="top">
          <IconButton
            sx={{ width: "40px", height: "40px" }}
            onClick={() => setIsAddLinkOpen(true)}
          >
            <InsertLinkOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {allowedData.attachments && (
        <Tooltip title="Add Video" placement="top">
          <IconButton
            sx={{ width: "40px", height: "40px" }}
            onClick={() => setIsAddVideoOpen(true)}
          >
            <YouTubeIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {allowedData.polls && (
        <Tooltip title="Add Poll" placement="top">
          <IconButton
            sx={{ width: "40px", height: "40px" }}
            onClick={handleAddPoll}
          >
            <LeaderboardOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {allowedData.content && (
        <Tooltip title="Add Emoji" placement="top">
          <IconButton sx={{ width: "40px", height: "40px" }}>
            <EmojiEmotionsOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {allowedData.attachments && (
        <div className={styles.GIF}>
          <Tooltip title="Add GIF" placement="top">
            <IconButton
              sx={{ width: "40px", height: "40px" }}
              onClick={() => setIsAddGifOpen((open) => !open)}
            >
              <GifOutlinedIcon
                sx={{
                  fontSize: "40px",
                  color: isAddGifOpen ? "#202124" : "#909090",
                }}
              />
            </IconButton>
          </Tooltip>
          {isAddGifOpen && <GifPicker onClose={() => setIsAddGifOpen(false)} />}
        </div>
      )}
      {allowedData.categories && data.categories && (
        <Select
          value={data.categories.filter(({ chosen }) => chosen)[0]?.name || ""}
          onChange={(e) =>
            dispatch({ type: "SET_CATEGORY", payload: e.target.value })
          }
          displayEmpty
          renderValue={(selected) => {
            if (!selected.length) {
              return <span>Select a category</span>;
            } else {
              return selected;
            }
          }}
          sx={{
            ".MuiOutlinedInput-notchedOutline": { border: 0 },
            height: "40px",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          {data.categories.map(({ name, description }) => {
            return (
              <MenuItem key={name} value={name}>
                <ListItemText primary={name} secondary={description} />
              </MenuItem>
            );
          })}
        </Select>
      )}
      {/* Followings are Dialogs toggled by Toolbar buttons */}
      <AddLinkDialog
        open={isAddLinkOpen}
        onClose={() => setIsAddLinkOpen(false)}
      />
      <AddVideoDialog
        open={isAddVideoOpen}
        onClose={() => setIsAddVideoOpen(false)}
      />
      <Dialog
        open={isRemovePollOpen}
        title="Remove poll?"
        subTitle="Are you sure you want to remove this poll"
        onClose={() => setIsRemovePollOpen(false)}
        submitButtonText="Confirm"
        onSubmit={() => {
          dispatch({ type: "REMOVE_ALL_POLL" });
          setIsRemovePollOpen(false);
        }}
      />
    </div>
  );
}
