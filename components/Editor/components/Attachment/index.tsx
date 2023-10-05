import { useData, useDataDispatch } from "../../providers/DataProvider";
import FilePreview from "./components/FilePreview";
import Carousel from "./components/Carousel";

import styles from "./styles.module.css";
import { useRef, useState } from "react";

import { v4 as getId } from "uuid";
import { getDataURL } from "../../utils";

import AddIcon from "@mui/icons-material/Add";
import FullScreenCarousel from "./components/FullScreenCarousel";

export type AttachmentProps = {
  readOnly: boolean;
  theme: "post" | "comment";
};

export default function Attachment({ readOnly, theme }: AttachmentProps) {
  const { attachments } = useData();
  const dispatch = useDataDispatch();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  const [id, setId] = useState("");

  if (!attachments) return null;

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

  // Theme[Post|Comment] has different Size
  // Video and File Attachment has different Aspect Ratio
  const totalScrollWidth =
    attachments.length * 16 +
    attachments.reduce(
      (sum, attachment) => {
        if (attachment.fileType === "video") {
          if (theme === "post") return sum + 370;
          else return sum + 176;
        } else {
          if (theme === "post") return sum + 210;
          else return sum + 100;
        }
      },
      theme === "post" ? 210 : 100
    );

  // Video comes first, then File/GIF, etc
  const sortedAttachments = [
    ...attachments.filter(({ fileType }) => fileType === "video"), // Video Attachments
    ...attachments.filter(({ fileType }) => fileType !== "video"), // Other Attachments
  ];

  return (
    <Carousel totalScrollWidth={totalScrollWidth} theme={theme}>
      {sortedAttachments.map((attachment) => {
        return (
          <FilePreview
            key={attachment._id}
            attachment={attachment}
            readOnly={false}
            theme="post"
            onOpenFullScreen={() => {
              setId(attachment._id);
              setIsFullScreenOpen(true);
            }}
          />
        );
      })}
      <label
        className={styles.addAttachmentButton}
        style={{
          height: theme === "post" ? "210px" : "100px",
          width: theme == "post" ? "210px" : "100px",
        }}
      >
        <input
          style={{ display: "none" }}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          ref={inputRef}
        />
        <AddIcon fontSize="large" color="secondary" />
      </label>
      {isFullScreenOpen && (
        <FullScreenCarousel
          attachments={sortedAttachments}
          open={isFullScreenOpen}
          onClose={() => setIsFullScreenOpen(false)}
          initialId={id}
        />
      )}
    </Carousel>
  );
}
