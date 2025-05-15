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
import { useQueryClient } from "@tanstack/react-query";
import { Share2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "./ui/button";

export default function SharePost({ postId }: { postId: number }) {
  const sharePost = useSharedPost();
  const session = useSessionStore((s) => s.session);
  const queryClient = useQueryClient();
  const { data: sharedPosts } = useFetchRecords({
    model: "Shared_Post",
    query: [{ key: "post", operator: "=", value: postId?.toString() }],
  });
  const isPostShared = sharedPosts?.some((r) => r.user === session?.user?.id);

  const onSharedPost = async (postId: number) => {
    console.log("🚀 ~ Home ~ postId:", postId);
    try {
      const res = await sharePost.mutateAsync({
        original_post: postId,
        user: session?.user?.id,
      });
      if (res.detail) toast.success(res.detail);
      else toast.success("Post shared!");
      queryClient.invalidateQueries({ queryKey: ["Shared_Post"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error");
    }
  };

  return (
    <div>
      <Dialog>
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
              onClick={() => onSharedPost(postId)}
            >
              <Share2 className="h-4 w-4 mr-1" />
            </Button>
          </DialogTrigger>
        )}
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">content</div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
