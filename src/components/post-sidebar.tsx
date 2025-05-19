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
import { Separator } from "@/components/ui/separator";
import { useFetchRecords } from "@/hooks/fetch-records";
import { useSessionStore } from "@/lib/sessionStore";
import { PostImageType, PostType, UserType } from "@/schemas";
import {
  BarChart2,
  Bookmark,
  FileCode2Icon,
  Image,
  MessageSquare,
  PlusCircle,
  Share2,
  ThumbsUp,
} from "lucide-react";
import { CreatePostForm } from "./create-post-form";

export default function PostsSidebar({
  posts,
  user,
}: {
  posts: PostType[];
  user?: UserType;
}) {
  const session = useSessionStore((s) => s.session);

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
      {session?.user?.id === user?.id && (
        <div className="">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-white">
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
      )}
      <Card className="border-gray-200 dark:border-gray-800 shadow-sm py-0 gap-3">
        <CardHeader className="bg-gray-100 py-5 dark:bg-gray-900">
          <CardTitle className="text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold">
                <Image className="h-4 w-4 text-gray-500" />
                <span>Media and Photos</span>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {posts?.length === 0 ||
          (posts?.length > 0 && postImages?.length === 0) ? (
            <div className="flex justify-center py-3">No Images or Videos.</div>
          ) : (
            <div className="space-y-3 grid grid-cols-2 gap-2">
              {postImages?.map((postImage: PostImageType) => {
                return (
                  <div key={postImage.id} className="">
                    <img
                      src={postImage.file}
                      className="w-full h-25 object-cover bg-gray-50"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-gray-200 dark:border-gray-800 shadow-sm py-0 gap-3">
        <CardHeader className="bg-gray-100 py-5 dark:bg-gray-900">
          <CardTitle className="text-sm ">
            <div className="flex items-center gap-2 font-bold">
              <BarChart2 className="h-4 w-4 text-gray-500" />
              <span>Post Statistics</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 py-2">
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
                  <Share2 className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                </div>
                <span>Total Shares</span>
              </div>
              <span className="font-semibold">
                {posts?.reduce((acc, cur: PostType) => {
                  return acc + cur.shared;
                }, 0)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="h-8 w-8 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                  <ThumbsUp className="h-4 w-4 text-green-500 dark:text-green-400" />
                </div>
                <span>Total Likes</span>
              </div>
              <span className="font-semibold">
                {posts?.reduce((acc, cur: PostType) => {
                  return acc + cur.likes;
                }, 0)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                </div>
                <span>Comments</span>
              </div>
              <span className="font-semibold">
                {posts?.reduce((acc, cur: PostType) => {
                  return acc + cur.comments;
                }, 0)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="h-8 w-8 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                  <Bookmark className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                </div>
                <span>Saved</span>
              </div>
              <span className="font-semibold">
                {posts?.reduce((acc, cur: PostType) => {
                  return acc + cur.saved;
                }, 0)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
