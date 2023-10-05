export type EditorData = {
  title?: string;
  content?: string;
  polls?: Array<Poll>;
  attachments?: Array<Attachment>;
  categories?: Array<Category>;
};

export type Poll = {
  _id: string;
  option: string;
  votes: string[];
};

export type Attachment = {
  _id: string;
  fileName: string;
  fileType: string;
  url: string | Promise<string>;
};

export type Category = {
  name: string;
  description: string;
  chosen: boolean;
};

export type AllowedData = Record<keyof EditorData, boolean>;

export type EditorProps = {
  editorId: string;
  readOnly: boolean;
  theme: "post" | "comment";
  allowedData: AllowedData;
  initialData: EditorData;
};
