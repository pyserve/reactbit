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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PostType } from "@/schemas";
import {
  BookmarkIcon,
  MessageCircle,
  MoreHorizontal,
  Share2,
  ThumbsUp,
} from "lucide-react";
import UserAvatar from "./user-avatar";

export default function PostCard({ post }: { post: PostType }) {
  const onLike = (postId: number) => {
    console.log("🚀 ~ Home ~ postId:", postId);
  };

  const onBookmark = (postId: number) => {
    console.log("🚀 ~ Home ~ postId:", postId);
  };

  return (
    <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black overflow-hidden">
      <CardHeader className="pb-1">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <UserAvatar />
            <div>
              <div className="font-semibold">{post.user?.display_name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                @{post.user?.username} ·{" "}
                {new Date(post.created_at).toDateString()}{" "}
                {new Date(post.created_at).toLocaleTimeString()}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Save post</DropdownMenuItem>
              <DropdownMenuItem>Hide post</DropdownMenuItem>
              <DropdownMenuItem>Report post</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-1">
        <p className="mb-1 text-sm text-justify">{post.caption}</p>
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
