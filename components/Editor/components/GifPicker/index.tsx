import React, { useEffect, useState } from "react";

import { useDataDispatch } from "../../providers/DataProvider";
import { v4 as getId } from "uuid";

import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

import styles from "./styles.module.css";

// Only typed the required data
export type GiphyData = {
  id: string;
  title: string;
  images: {
    fixed_height: {
      url: string;
    };
  };
};

export type GifPickerProps = {
  onClose: () => void;
};

export default function GifPicker({ onClose }: GifPickerProps) {
  const [query, setQuery] = useState("");
  const [gifs, setGifs] = useState<GiphyData[]>([]);
  const [offset, setOffset] = useState(0);

  const dispatch = useDataDispatch();

  // Add Event Delegation to remove the GifPicker when click elsewhere
  useEffect(() => {
    function closeDelegation(event: Event) {
      const target = event.target;

      if (target instanceof HTMLElement && !target.closest("#gif-picker")) {
        onClose();
      }
    }

    document.addEventListener("click", closeDelegation);

    return () => {
      document.removeEventListener("click", closeDelegation);
    };
  }, []);

  async function fetchGifs(offset: number) {
    const key = process.env.NEXT_PUBLIC_GIF_API_KEY;
    if (key === undefined) {
      throw new Error("Read Environment Variable Failed");
    }

    const baseURL = "https://api.giphy.com/v1/gifs/search";
    const params = new URLSearchParams();

    params.append("q", query || "happy");
    params.append("api_key", key);
    params.append("offset", String(offset));
    params.append("limit", "12");

    const res = await fetch(baseURL + "?" + params.toString());

    if (!res.ok) {
      throw new Error("Fetch Failed");
    }

    const { data }: { data: GiphyData[] } = await res.json();

    return data;
  }

  useEffect(() => {
    const timerID = setTimeout(
      () => {
        fetchGifs(offset)
          .then((gifs) => {
            setGifs(gifs);
            setOffset(12);
          })
          .catch((err) => {
            console.error(err);
          });
      },
      !query && !gifs.length ? 0 : 300
    );

    return () => {
      clearTimeout(timerID);
    };
  }, [query]);

  function handleScroll(event: React.SyntheticEvent<HTMLElement>) {
    const target = event.target;

    if (!(target instanceof HTMLElement)) return;

    if (target.scrollHeight - target.scrollTop === target.clientHeight) {
      fetchGifs(offset)
        .then((newGifs) => {
          setGifs((oldGifs) => [...oldGifs, ...newGifs]);
          setOffset((offset) => offset + 12);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  return (
    <section id="gif-picker" className={styles.container}>
      <div className={styles.scrollContainer} onScroll={handleScroll}>
        <TextField
          variant="outlined"
          autoFocus
          fullWidth
          id="input-with-icon-textfield"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {query && (
                  <IconButton size="small" onClick={() => setQuery("")}>
                    <ClearIcon />
                  </IconButton>
                )}
              </InputAdornment>
            ),
            style: {
              padding: "0 4px 0 12px",
              height: "42px",
            },
          }}
          inputProps={{
            style: {
              padding: "0",
            },
          }}
        />
        {!gifs.length ? (
          <div className={styles.noResult}>{query && <p>No results</p>}</div>
        ) : (
          <ImageList className={styles.gifContainer} cols={2} gap={8}>
            {gifs.map((gif) => (
              <ImageListItem
                key={gif.id}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  dispatch({
                    type: "ADD_ATTACHMENT",
                    payload: {
                      _id: getId(),
                      fileName: gif.title,
                      fileType: "gif",
                      url: gif.images.fixed_height.url,
                    },
                  });
                  onClose();
                }}
              >
                <img
                  src={gif.images.fixed_height.url}
                  alt={gif.title}
                  loading="lazy"
                  style={{
                    objectFit: "cover",
                    height: 77,
                    width: 112,
                    borderRadius: 4,
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        )}
      </div>
      <footer className={styles.footer}>
        <div>
          <img
            src="https://assets.skool.com/skool/a73ebc0217dc4f6381a16b7cee53528b.png"
            width={106}
            height={44}
            alt="Powered by GIPHY"
          />
        </div>
      </footer>
    </section>
  );
}
