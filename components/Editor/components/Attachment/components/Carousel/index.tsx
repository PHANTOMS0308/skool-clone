import React, { useEffect, useRef, useState } from "react";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import { visuallyHidden } from "@mui/utils";

import styles from "./styles.module.css";

export type CarouselProps = {
  children: React.ReactNode;
  theme: "post" | "comment";
  totalScrollWidth: number; // The total length of children
};

// Right now we assume the container is fixed width
// If container can be resized, then it should be refactored
export default function Carousel(props: CarouselProps) {
  const { children, theme, totalScrollWidth } = props;
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLUListElement | null>(null);
  const scrollOffset = (theme === "post" ? 210 : 100) + 16;

  function handleScrollToLeft() {
    if (scrollPosition - scrollOffset <= 0) {
      setScrollPosition(0);
    } else {
      setScrollPosition((scrollPosition) => scrollPosition - 215);
    }
  }

  function handleScrollToRight() {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;

    if (totalScrollWidth - containerWidth - scrollOffset <= scrollPosition) {
      setScrollPosition(totalScrollWidth - containerWidth);
    } else {
      setScrollPosition((scrollPosition) => scrollPosition + scrollOffset);
    }
  }

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollPosition;
    }
  }, [scrollPosition]);

  return (
    <section
      aria-describedby="carousel-heading"
      className={styles.mainContainer}
      style={{ height: theme === "post" ? "210px" : "100px" }}
    >
      <Box id="carousel-heading" sx={visuallyHidden}>
        Attachments Carousel
      </Box>
      {scrollPosition > 0 && (
        <IconButton
          aria-label="Scroll To Left"
          className={styles.scrollToLeftButton}
          onClick={handleScrollToLeft}
        >
          <KeyboardArrowLeftIcon />
        </IconButton>
      )}
      <ul ref={containerRef} className={styles.contentContainer}>
        {children}
      </ul>
      {containerRef.current &&
        scrollPosition <
          totalScrollWidth - containerRef.current.offsetWidth && (
          <IconButton
            aria-label="Scroll To Right"
            className={styles.scrollToRightButton}
            onClick={handleScrollToRight}
          >
            <KeyboardArrowRightIcon />
          </IconButton>
        )}
    </section>
  );
}
