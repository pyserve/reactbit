import { api } from "@/lib/api";
import { useSessionStore } from "@/lib/sessionStore";
import { PostType } from "@/schemas";
import { useQueryClient } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import { Edit3, Loader2 } from "lucide-react";
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

const cleanHtml = (html: string) => {
  let cleaned = DOMPurify.sanitize(html);
  cleaned = cleaned.replace(/<p>(<br\s*\/?>|\s|&nbsp;)*<\/p>/gi, "");
  return cleaned.trim();
};

export const CreatePostForm = ({
  post,
  onSuccess,
}: {
  post?: PostType;
  onSuccess?: () => void;
}) => {
  const isEdit = !!post;
  const [content, setContent] = useState(
    post?.caption ? cleanHtml(post.caption) : ""
  );
  const [IsLoading, setIsLoading] = useState(false);
  const session = useSessionStore((s) => s.session);

  const postImages = useRef<{ id: number; file: string }[]>(
    post?.images?.map((img) => ({
      id: img?.id,
      file: img?.file,
    })) ?? []
  );
  const [editorKey, setEditorKey] = useState(0);
  const queryClient = useQueryClient();

  const customImage = Image.extend({
    addNodeView() {
      return ({ node }) => {
        const src = node.attrs.src;
        const alt = node.attrs.alt || "";

        const img = document.createElement("img");
        img.src = src;
        img.alt = alt;
        img.style.maxWidth = "100%";
        img.style.height = "auto";

        return {
          dom: img,
          async destroy() {
            const image = postImages.current.find((img) => img.file === src);
            postImages.current = postImages.current.filter(
              (img) => img.file !== src
            );
            if (image) {
              console.log("🚀 ~ destroy ~ image:", image);
              const res = await api.delete(`/post_images/${image.id}/`);
              console.log("🚀 ~ destroy ~ res:", res);
            }
          },
        };
      };
    },
  });

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
    customImage.configure({
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

  const isHtmlStringEffectivelyEmpty = (html: string): boolean => {
    const fragment = document.createRange().createContextualFragment(html);
    const hasContent =
      fragment.querySelector("img, video, iframe, svg, canvas, audio") !==
        null ||
      (fragment.textContent && fragment.textContent.trim() !== "");
    return !hasContent;
  };

  const SubmitPost = async () => {
    setIsLoading(true);
    console.log(content);
    try {
      const isEmpty =
        isHtmlStringEffectivelyEmpty(content) &&
        postImages.current.length === 0;
      if (isEmpty) throw new Error("Either text or image must be provided!");

      const payload = {
        user: session?.user?.id,
        caption: content,
        images: postImages.current.map((p) => p.id),
      };

      let res;
      if (isEdit) {
        res = await api.patch(`/posts/${post.id}/`, payload);
      } else {
        res = await api.post("/posts/", payload);
      }
      console.log("🚀 ~ SubmitPost ~ res:", res);
      toast.success(
        isEdit ? "Post updated successfully!" : "Post created successfully!"
      );
      setContent("");
      postImages.current = [];
      setEditorKey((prev) => prev + 1);
      queryClient.invalidateQueries({ queryKey: ["Post"] });
      onSuccess?.();
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
              <span>{isEdit ? "Updating Post..." : "Creating Post..."}</span>
            </div>
          ) : isEdit ? (
            <span className="flex gap-2">
              <Edit3 /> Update Post
            </span>
          ) : (
            <span className="flex gap-2">
              <Edit3 /> Create Post
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};
