import React, { useState, useEffect, createContext, useContext } from "react";

const OUTSIDE_PROVIDER = Symbol("OutsideProvider");
const RangeContext = createContext<Range | null | typeof OUTSIDE_PROVIDER>(
  OUTSIDE_PROVIDER
);

export interface RangeProviderProps {
  children: React.ReactNode;
  editorId: string;
  readOnly: boolean;
}

export function RangeProvider(props: RangeProviderProps) {
  const { children, editorId, readOnly } = props;
  const [range, setRange] = useState<Range | null>(null);

  useEffect(() => {
    function updateRange() {
      const selection = document.getSelection();
      const editorElem = document.querySelector(
        `[data-editor-id="${editorId}"]`
      );

      if (
        selection &&
        selection.rangeCount > 0 &&
        editorElem &&
        editorElem.contains(selection.anchorNode)
      ) {
        setRange(selection.getRangeAt(0));
      }
    }

    if (!readOnly) {
      document.addEventListener("selectionchange", updateRange);
    }

    return () => {
      document.removeEventListener("selectionchange", updateRange);
    };
  }, [editorId, readOnly]);

  return (
    <RangeContext.Provider value={range}>{children}</RangeContext.Provider>
  );
}

export function useRange() {
  const rangeContext = useContext(RangeContext);

  if (rangeContext === OUTSIDE_PROVIDER) {
    throw new Error("useRange must be used within RangeProvider");
  }

  return rangeContext;
}
