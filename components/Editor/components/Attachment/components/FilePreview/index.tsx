import { useEffect } from "react";

import { Attachment } from "@/components/Editor/types";
import { useDataDispatch } from "@/components/Editor/providers/DataProvider";
import { getVideoId, getVideoThumbnail } from "@/components/Editor/utils";

import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import ClearIcon from "@mui/icons-material/Clear";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import SmartDisplayIcon from "@mui/icons-material/SmartDisplay";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";

import styles from "./styles.module.css";
import { SvgIcon } from "@mui/material";

export type FilePreviewProps = {
  attachment: Attachment;
  readOnly: boolean;
  theme: "post" | "comment";
  onOpenFullScreen: () => void;
};

export default function FilePreview(props: FilePreviewProps) {
  const { attachment, readOnly, theme, onOpenFullScreen } = props;
  const dispatch = useDataDispatch();

  // When URL is Promise, we try to resolve it in useEffect
  useEffect(() => {
    if (typeof attachment.url === "string") return;

    attachment.url
      .then((url) => {
        // If resolve, we update with the Base64 URL
        dispatch({
          type: "SET_ATTACHMENT",
          payload: { _id: attachment._id, attachment: { url } },
        });
      })
      .catch((err) => {
        // If reject, we update with 'NULL', use this to generate a bad link
        console.error(err);
        dispatch({
          type: "SET_ATTACHMENT",
          payload: { _id: attachment._id, attachment: { url: "NULL" } },
        });
      });
  }, []);

  // If the file is still reading, then show the Spinner
  if (attachment.url instanceof Promise) {
    return (
      <li
        className={styles.container}
        style={{
          width: theme === "post" ? "210px" : "100px",
          height: theme === "post" ? "210px" : "100px",
        }}
      >
        <CircularProgress
          sx={{ color: "#2e6ef5" }}
          size={theme === "post" ? 80 : 40}
          thickness={2}
          disableShrink
        />
      </li>
    );
  }

  // ReadOnly vs Editable
  return (
    <li
      className={styles.container}
      style={{
        width:
          theme === "post"
            ? `${attachment.fileType === "video" ? "370" : "210"}px`
            : `${attachment.fileType === "video" ? "170" : "100"}px`,
        height: theme === "post" ? "210px" : "100px",
        cursor: readOnly ? "zoom-in" : "default",
      }}
    >
      <img
        className={styles.image}
        src={
          attachment.fileType === "video"
            ? getVideoThumbnail(getVideoId(attachment.url))
            : attachment.url
        }
        alt={`Uploaded File: ${attachment.fileName}`}
      />
      {attachment.fileType === "video" && (
        <SvgIcon style={{ position: "absolute", fontSize: "65" }}>
          <svg
            width="64"
            height="46"
            version="1.1"
            viewBox="0 0 64 46"
            fill="#202124"
          >
            <path
              d="M62.6071 7.28471C61.8729 4.52706 60.2635 2.19294 
              57.5059 1.45882C52.5082 0.122353 32 0 32 0C32 0 11.4918 
              0.122353 6.49412 1.45882C3.73647 2.19294 2.13647 4.52706 
              1.39294 7.28471C0.0564706 12.2824 0 22.5882 0 22.5882C0 
              22.5882 0.0564706 32.8941 1.39294 37.8918C2.12706 40.6494 
              3.73647 42.9835 6.49412 43.7176C11.4918 45.0541 32 45.1765 
              32 45.1765C32 45.1765 52.5082 45.0541 57.5059 43.7176C60.2635 
              42.9835 61.8729 40.6494 62.6071 37.8918C63.9435 32.8941 64 22.5882 
              64 22.5882C64 22.5882 63.9435 12.2824 62.6071 7.28471Z"
              fillOpacity="1"
              fill="#202124"
            />
            <path d="M42.3533 22.5883L25.4121 13.1765V32" fill="#FFFFFF" />
          </svg>
        </SvgIcon>
      )}
      {!readOnly && (
        <div className={styles.buttonContainer}>
          <IconButton
            className={styles.fullScreenButton}
            onClick={onOpenFullScreen}
          >
            <FullscreenIcon />
          </IconButton>
          <IconButton
            className={styles.removeButton}
            onClick={() => {
              dispatch({ type: "REMOVE_ATTACHMENT", payload: attachment._id });
            }}
          >
            <ClearIcon />
          </IconButton>
        </div>
      )}
    </li>
  );
}
