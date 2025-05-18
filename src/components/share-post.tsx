import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFetchRecords } from "@/hooks/fetch-records";
import { useSharedPost } from "@/hooks/post-engagement";
import { useSessionStore } from "@/lib/sessionStore";
import { PostType } from "@/schemas";
import { useQueryClient } from "@tanstack/react-query";
import { Share2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

export default function SharePost({ postId }: { postId: number }) {
  const sharePost = useSharedPost();
  const [open, setOpen] = useState(false);
  const [newCaption, setNewCaption] = useState("");
  const session = useSessionStore((s) => s.session);
  const queryClient = useQueryClient();
  const { data: posts } = useFetchRecords({
    model: "Post",
    query: [{ key: "id", operator: "=", value: postId?.toString() }],
  });
  const { data: sharedPosts } = useFetchRecords({
    model: "Post",
    query: [{ key: "original_post", operator: "=", value: postId?.toString() }],
  });
  const isPostShared = sharedPosts?.some(
    (r: any) => r.user === session?.user?.id
  );
  const post: PostType = posts?.[0];

  const onSharedPost = async (postId: number) => {
    console.log("🚀 ~ Home ~ postId:", postId);
    try {
      const res = await sharePost.mutateAsync({
        original_post: postId,
        user: session?.user?.id,
        caption: newCaption,
        is_shared: true,
      });
      if (res.detail) toast.success(res.detail);
      else toast.success("Post shared!");
      setNewCaption("");
      queryClient.invalidateQueries({ queryKey: ["Post"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error");
    } finally {
      setOpen(false);
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        {isPostShared ? (
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 dark:text-blue-400"
            onClick={() => onSharedPost(postId)}
          >
            <Share2 className="h-4 w-4 mr-1" />
          </Button>
        ) : (
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 dark:text-gray-400"
            >
              <Share2 className="h-4 w-4 mr-1" />
            </Button>
          </DialogTrigger>
        )}
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex gap-2 items-center">
              <Share2 />
              <span>Share Post</span>
            </DialogTitle>
            <DialogDescription>Click save when you're done.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div
              className="w-full"
              dangerouslySetInnerHTML={{ __html: post?.caption }}
            ></div>
            <div className="">
              <Textarea
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                placeholder="Write something about this post."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant={"secondary"}
              onClick={() => setOpen(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button onClick={() => onSharedPost(postId)} type="submit">
              Share Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
