import Head from "next/head";
import { Inter } from "next/font/google";
import Editor from "@/components/Editor";
import { TURBO_TRACE_DEFAULT_MEMORY_LIMIT } from "next/dist/shared/lib/constants";
import { Stack } from "@mui/material";
import { v4 as getId } from "uuid";

const inter = Inter({ subsets: ["latin"] });

export default function EditorDemoPage() {
  const initialData = {
    title: "",
    content: "",
    categories: [
      {
        name: "General Discussion",
        description: "Everyone can post",
        chosen: false,
      },
      { name: "Admin Only", description: "Only Admin can post", chosen: false },
    ],
    polls: [
      { _id: getId(), option: "This is option #1", votes: [] },
      { _id: getId(), option: "This is option #2", votes: [] },
      { _id: getId(), option: "This is option #3", votes: [] },
    ],
  };

  const allowedData = {
    title: true,
    content: true,
    categories: true,
    polls: true,
    attachments: true,
  };

  return (
    <>
      <Head>
        <title>Text Editor Demo</title>
        <meta name="description" content="Text Editor Demo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ padding: "2rem", height: "4000px" }}>
        <Stack alignContent="center" justifyContent="center">
          <Editor
            editorId="demo-editor"
            allowedData={allowedData}
            initialData={initialData}
            readOnly={false}
            theme="post"
          />
          <div></div>
        </Stack>
      </main>
    </>
  );
}
