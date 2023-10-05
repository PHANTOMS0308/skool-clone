import React from "react";

// Providers
import {
  DataProvider,
  useData,
  useDataDispatch,
} from "./providers/DataProvider";
import { RangeProvider } from "./providers/RangeProvider";
import MuiThemeProvider from "./providers/MuiThemeProvider";

// Components
import Title from "./components/Title";
import TextEditor from "../TextEditor";
import PollEditor from "./components/Poll/Editor";
import ToolBar from "./components/ToolBar";

// Types
import { EditorProps, AllowedData, EditorData } from "./types";
import Attachment from "./components/Attachment";

// InitialData must be a subset of allowedData
export default function Editor(props: EditorProps) {
  const { editorId, readOnly, theme, allowedData, initialData } = props;

  return (
    <MuiThemeProvider>
      <RangeProvider readOnly={readOnly} editorId={editorId}>
        <DataProvider initialData={initialData}>
          <section>
            {allowedData.title && <Title />}
            {allowedData.content && (
              <TextEditor
                id={editorId}
                placeholder="Write Something..."
                ariaLabel=""
              />
            )}
            {allowedData.polls && <PollEditor />}
            {allowedData.attachments && (
              <Attachment readOnly={readOnly} theme={theme} />
            )}
            {!readOnly && <ToolBar allowedData={allowedData} />}
          </section>
        </DataProvider>
      </RangeProvider>
    </MuiThemeProvider>
  );
}
