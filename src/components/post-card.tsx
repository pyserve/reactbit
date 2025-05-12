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
import { api } from "@/lib/api";
import { extractDate } from "@/lib/utils";
import { PostType } from "@/schemas";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import {
  BookmarkIcon,
  Edit,
  MessageCircle,
  MoreHorizontal,
  Share,
  Share2,
  ThumbsUp,
  Trash,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import PostCardSkeleton from "./skeletons/post-card-skeleton";
import UserAvatar from "./user-avatar";

export default function PostCard({ post }: { post: PostType }) {
  const { data: users } = useFetchRecords({
    model: "User",
    query: [{ key: "id", operator: "=", value: post.user.toString() }],
  });
  const queryClient = useQueryClient();
  const user = users?.[0];
  const [open, setOpen] = useState(false);
  const { confirmDialog } = useConfirmDialog();

  const onLike = (postId: number) => {
    console.log("🚀 ~ Home ~ postId:", postId);
  };

  const onBookmark = (postId: number) => {
    console.log("🚀 ~ Home ~ postId:", postId);
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
    <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black overflow-hidden">
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
              <DropdownMenuItem
                // onSelect={(e) => e.preventDefault()}
                onClick={() => handleDelete(post.id)}
              >
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
        <div className="flex gap-4">
          <Button
            variant="ghost"
            size="sm"
            className={
              post?.isLiked
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400"
            }
            onClick={() => onLike(post.id)}
          >
            <ThumbsUp className="h-4 w-4 mr-1" />
            {post.likes}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 dark:text-gray-400"
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            {post?.comments}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 dark:text-gray-400"
          >
            <Share2 className="h-4 w-4 mr-1" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className={
            post?.isBookmarked
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400"
          }
          onClick={() => onBookmark(post.id)}
        >
          <BookmarkIcon className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
