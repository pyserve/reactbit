import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useConfirmDialog } from "@/hooks/async-alert-dialog";
import { useFetchRecords } from "@/hooks/fetch-records";
import { useLikePost, useSavedPost } from "@/hooks/post-engagement";
import { api } from "@/lib/api";
import { useSessionStore } from "@/lib/sessionStore";
import { extractDate } from "@/lib/utils";
import { PostType } from "@/schemas";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import {
  Bookmark,
  BookmarkCheck,
  Edit,
  MessageCircle,
  MoreHorizontal,
  Share,
  Trash,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import PostComments from "./post-comments";
import SharePost from "./share-post";
import PostCardSkeleton from "./skeletons/post-card-skeleton";
import UserAvatar from "./user-avatar";

export default function PostCard({ post }: { post: PostType }) {
  const session = useSessionStore((s) => s.session);
  const { data: users } = useFetchRecords({
    model: "User",
    query: [{ key: "id", operator: "=", value: post.user?.toString() }],
  });
  const { data: reactions } = useFetchRecords({
    model: "Post_Reaction",
    query: [{ key: "post", operator: "=", value: post.id?.toString() }],
  });
  const { data: savedPosts } = useFetchRecords({
    model: "Saved_Post",
    query: [{ key: "post", operator: "=", value: post.id?.toString() }],
  });
  const { data: comments } = useFetchRecords({
    model: "Post_Comment",
    query: [{ key: "post", operator: "=", value: post?.id?.toString() }],
  });

  const queryClient = useQueryClient();
  const user = users?.[0];
  const isPostLiked = reactions?.some((r) => r.user === session?.user?.id);
  const isPostSaved = savedPosts?.some((r) => r.user === session?.user?.id);
  const [open, setOpen] = useState(false);
  const { confirmDialog } = useConfirmDialog();
  const likePost = useLikePost();
  const savePost = useSavedPost();

  const onPostLike = async (postId: number) => {
    console.log("🚀 ~ Home ~ postId:", postId);
    try {
      const res = await likePost.mutateAsync({
        post: postId,
        user: session?.user?.id,
      });
      if (res.detail) toast.success(res.detail);
      else toast.success("Post liked!");
      queryClient.invalidateQueries({ queryKey: ["Post_Reaction"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error");
    }
  };

  const onSavedPost = async (postId: number) => {
    console.log("🚀 ~ Home ~ postId:", postId);
    try {
      const res = await savePost.mutateAsync({
        post: postId,
        user: session?.user?.id,
      });
      if (res.detail) toast.success(res.detail);
      else toast.success("Post saved!");
      queryClient.invalidateQueries({ queryKey: ["Saved_Post"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error");
    }
  };

  const handleDelete = async (postId: number) => {
    const ok = await confirmDialog({});
    if (ok) {
      try {
        const res = await api.delete(`/posts/${postId}/`);
        console.log("🚀 ~ handleDelete ~ res:", res);
        queryClient.invalidateQueries({ queryKey: ["Post"] });
        toast.success(`Post ${postId} deleted successfully!`);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Error");
      }
    }
  };
  if (!post || !user) return <PostCardSkeleton />;

  return (
    <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black overflow-hidden pb-0">
      <CardHeader className="pb-1">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <UserAvatar user={user} size={50} />
            <div>
              <Link to={`/profile/${user?.username}`}>
                <div className="font-semibold">{user?.display_name}</div>
              </Link>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                @{user?.username} · {extractDate(post.created_at)}
              </div>
            </div>
          </div>

          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit /> Edit post
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share /> Share post
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(post.id)}>
                <Trash /> Delete post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-1">
        <p
          className="mb-1 text-sm text-justify"
          dangerouslySetInnerHTML={{ __html: post.caption }}
        ></p>
        {post.images.length && (
          <div className="rounded-md overflow-hidden mt-3 border border-gray-200 dark:border-gray-800">
            <img src={post.images?.[0]?.file} className="w-[100%]" />
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t border-gray-100 dark:border-gray-900 pt-3 flex justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className={
              isPostLiked
                ? "text-blue-600 font-bold dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400"
            }
            onClick={() => onPostLike(post.id)}
          >
            {isPostLiked ? (
              <FaThumbsUp className="h-5 w-5 text-blue-500" />
            ) : (
              <FaRegThumbsUp className="h-5 w-5 text-gray-500" />
            )}
            <span>{reactions?.length}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 dark:text-gray-400"
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            {comments?.length}
          </Button>
          <SharePost postId={post?.id} />
        </div>
        <Button
          variant="ghost"
          size="sm"
          className={
            isPostSaved
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400"
          }
          onClick={() => onSavedPost(post.id)}
        >
          {isPostSaved ? (
            <BookmarkCheck className="h-4 w-4" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </Button>
      </CardFooter>
      <PostComments postId={post?.id} />
    </Card>
  );
}
