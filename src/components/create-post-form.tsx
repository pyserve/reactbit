import { useState } from "react";
import "react-image-crop/dist/ReactCrop.css";
import RichTextEditor, { BaseKit } from "reactjs-tiptap-editor";
import { Bold } from "reactjs-tiptap-editor/bold";
import { Emoji } from "reactjs-tiptap-editor/emoji";
import { FontFamily } from "reactjs-tiptap-editor/fontfamily";
import { FontSize } from "reactjs-tiptap-editor/fontsize";
import { History } from "reactjs-tiptap-editor/history";
import { Image } from "reactjs-tiptap-editor/image";
import { Mention } from "reactjs-tiptap-editor/mention";
import "reactjs-tiptap-editor/style.css";
import { Table } from "reactjs-tiptap-editor/table";
import { Button } from "./ui/button";

const extensions = [
  BaseKit.configure({
    placeholder: {
      showOnlyCurrent: true,
    },
    characterCount: {
      limit: 50_000,
    },
  }),
  FontFamily,
  FontSize,
  Bold,
  Emoji,
  Table,
  History,
  Mention,
  Image.configure({
    upload: (files: File) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(URL.createObjectURL(files));
        }, 500);
      });
    },
  }),
];

const DEFAULT = "";

export const CreatePostForm = () => {
  const [content, setContent] = useState(DEFAULT);

  const SubmitPost = () => {};

  const onChangeContent = (value: any) => {
    console.log("🚀 ~ onChangeContent ~ value:", value);
    setContent(value);
  };

  return (
    <div>
      <RichTextEditor
        output="html"
        content={content}
        onChangeContent={onChangeContent}
        extensions={extensions}
      />
      <div className="flex justify-end m-2">
        <Button
          type="button"
          variant={"default"}
          className=""
          onClick={SubmitPost}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};
