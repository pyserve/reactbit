"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useFetchRecords } from "@/hooks/fetch-records";
import { PostImageType, PostType } from "@/schemas";
import {
  BarChart2,
  Bookmark,
  Clock,
  FileCode2Icon,
  Image,
  MessageSquare,
  MoreVertical,
  PlusCircle,
  ThumbsUp,
  TrendingUp,
} from "lucide-react";
import { CreatePostForm } from "./create-post-form";

export default function PostsSidebar({ posts }: { posts: PostType[] }) {
  console.log("🚀 ~ PostsSidebar ~ posts:", posts);
  const { data: postImages } = useFetchRecords({
    model: "Post_Image",
    query: [
      {
        key: "post__in",
        operator: "=",
        value: posts?.map((p) => p.id).join(","),
      },
    ],
  });

  return (
    <div className="space-y-4 sticky top-6">
      <div className="">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">
              <PlusCircle className="h-4 w-4" />
              Create New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full">
            <DialogHeader className="">
              <DialogTitle className="py-3 w-full flex items-center gap-2">
                <FileCode2Icon />
                <div>Create a Post</div>
              </DialogTitle>
              <DialogDescription>
                <CreatePostForm />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader className="">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Image className="h-4 w-4 text-gray-500" />
              Photos and Video
            </CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Most Recent</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  <span>Most Liked</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Most Comments</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="">
          {posts?.length === 0 ||
          (posts?.length > 0 && postImages?.length === 0) ? (
            <div className="flex justify-center">No Images or Videos.</div>
          ) : (
            <div className="space-y-3 grid grid-cols-2 gap-2">
              {postImages?.map((postImage: PostImageType) => {
                return (
                  <div key={postImage.id} className="">
                    <img src={postImage.file} className="w-full" />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader className="py-4 px-5">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-gray-500" />
            Post Statistics
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <PlusCircle className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </div>
                <span>Total Posts</span>
              </div>
              <span className="font-semibold">{posts?.length}</span>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                </div>
                <span>Total Views</span>
              </div>
              <span className="font-semibold">{posts?.views}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="h-8 w-8 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                  <ThumbsUp className="h-4 w-4 text-green-500 dark:text-green-400" />
                </div>
                <span>Total Likes</span>
              </div>
              <span className="font-semibold">{posts?.likes}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                </div>
                <span>Comments</span>
              </div>
              <span className="font-semibold">{posts?.comments}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="h-8 w-8 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                  <Bookmark className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                </div>
                <span>Saved</span>
              </div>
              <span className="font-semibold">{posts?.saved}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
