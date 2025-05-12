import { api } from "@/lib/api";
import { useSessionStore } from "@/lib/sessionStore";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
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

const DEFAULT = "";

export const CreatePostForm = () => {
  const [content, setContent] = useState(DEFAULT);
  const [IsLoading, setIsLoading] = useState(false);
  const session = useSessionStore((s) => s.session);
  const postImages = useRef<{ id: number; file: string }[]>([]);
  const [editorKey, setEditorKey] = useState(0);
  const queryClient = useQueryClient();

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
      upload: async (files: File) => {
        console.log("🚀 ~ upload: ~ files:", files);
        const formData = new FormData();
        formData.append("file", files);
        try {
          const res = await api.post("/post_images/", formData);
          console.log("🚀 ~ upload: ~ res:", res.data);
          postImages.current.push(res.data);
          return res.data?.file;
        } catch (error) {
          console.log(error instanceof Error ? error.message : "Error");
          return URL.createObjectURL(files);
        }
      },
    }),
  ];

  const SubmitPost = async () => {
    setIsLoading(true);
    console.log("🚀 ~ CreatePostForm ~ content:", { content, postImages });
    const isHtmlStringEffectivelyEmpty = (html: string): boolean => {
      const fragment = document.createRange().createContextualFragment(html);
      const text = fragment.textContent || "";
      return (
        text
          .replace(/\u00A0/g, "")
          .replace(/\s/g, "")
          .trim().length === 0
      );
    };

    try {
      if (
        isHtmlStringEffectivelyEmpty(content) &&
        postImages.current?.length == 0
      ) {
        throw new Error("Either text or image must be provided!");
      }
      const res = await api.post("/posts/", {
        user: session?.user?.id,
        caption: content,
        images: postImages.current.map((p) => p.id),
      });
      console.log("🚀 ~ SubmitPost ~ res:", res);
      setContent(DEFAULT);
      postImages.current = [];
      setEditorKey((prev) => prev + 1);
      toast.success("Post created sucessfully!");
      queryClient.invalidateQueries({ queryKey: ["Post"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error");
    } finally {
      setIsLoading(false);
    }
  };

  const onChangeContent = (value: string) => {
    setContent(value);
  };

  return (
    <div>
      <RichTextEditor
        key={editorKey}
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
          disabled={IsLoading}
        >
          {IsLoading ? (
            <div className="flex gap-2">
              <Loader2 className="animate-spin" />
              <span>Creating Post..</span>
            </div>
          ) : (
            "Create Post"
          )}
        </Button>
      </div>
    </div>
  );
};
