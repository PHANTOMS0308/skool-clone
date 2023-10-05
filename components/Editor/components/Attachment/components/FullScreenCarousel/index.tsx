import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import { Backdrop, IconButton } from "@mui/material";
import { VoidExpression } from "typescript";

import { useData } from "@/components/Editor/providers/DataProvider";
import { Attachment } from "@/components/Editor/types";

import { useEffect, useState } from "react";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import styles from "./styles.module.css";

export type FullScreenCarouselProps = {
  open: boolean;
  onClose: () => void;
  attachments: Attachment[];
  initialId: string;
};

export default function FullScreenCarousel(props: FullScreenCarouselProps) {
  const { open, onClose, attachments, initialId } = props;
  const [currentId, setCurrentId] = useState(initialId);

  // To disable scrollbar when Backdrop open, making it more like Skool
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const currentAttachment = attachments.find(({ _id }) => _id === currentId);

  if (!currentAttachment || currentAttachment.url instanceof Promise) {
    return null;
  }

  const isFirstAttachment = attachments[0]._id === currentId;
  const isLastAttachment = attachments.at(-1)?._id === currentId;

  return (
    <Backdrop
      className={styles.container}
      open={open}
      sx={{
        backgroundColor: "rgba(0,0,0,0.8)",
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      onClick={(e) => {
        if (!(e.target instanceof HTMLElement)) return;

        if (e.target.closest("header")) return;
        if (e.target.closest("button")) return;
        if (e.target.closest("iframe")) return;
        if (e.target.closest("img")) return;

        onClose();
      }}
    >
      <header className={styles.header}>
        <p>{currentAttachment.fileName}</p>
        <div>
          <a
            href={
              currentAttachment.fileType === "attachment"
                ? currentAttachment.url
                : undefined
            }
            download={currentAttachment.fileName}
          >
            <IconButton sx={{ marginRight: "10px" }}>
              <DownloadIcon />
            </IconButton>
          </a>
          <IconButton onClick={onClose}>
            <CloseIcon sx={{ fontSize: "30px" }} />
          </IconButton>
        </div>
      </header>
      <section className={styles.content}>
        {currentAttachment.fileType === "video" ? (
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            src={currentAttachment.url + "?autoplay=1&mute=1"}
          ></iframe>
        ) : (
          <img
            style={{
              borderRadius: "10px",
              maxWidth: "calc(100vw - 128px)",
              maxHeight: "calc(100vh - 56px - 32px - 32px)",
              ...(currentAttachment.fileType === "gif"
                ? { minHeight: "420px" }
                : {}),
            }}
            src={currentAttachment.url}
          />
        )}
      </section>
      {!isFirstAttachment && (
        <IconButton
          className={styles.scrollToLeftButton}
          onClick={() => {
            const index = attachments.findIndex(({ _id }) => _id === currentId);
            setCurrentId(attachments[index - 1]?._id);
          }}
        >
          <KeyboardArrowLeftIcon sx={{ fontSize: "30px" }} />
        </IconButton>
      )}
      {!isLastAttachment && (
        <IconButton
          className={styles.scrollToRightButton}
          onClick={() => {
            const index = attachments.findIndex(({ _id }) => _id === currentId);
            setCurrentId(attachments[index + 1]?._id);
          }}
        >
          <KeyboardArrowRightIcon sx={{ fontSize: "30px" }} />
        </IconButton>
      )}
    </Backdrop>
  );
}
