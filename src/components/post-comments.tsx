import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useFetchRecords } from "@/hooks/fetch-records";
import { usePostComment } from "@/hooks/post-engagement";
import { useSessionStore } from "@/lib/sessionStore";
import { useQueryClient } from "@tanstack/react-query";
import { MessageCircle, Send } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import PostCommentCard from "./post-comment-card";
import PostCommentSkeleton from "./skeletons/post-comment-skeleton";
import { Card, CardContent, CardTitle } from "./ui/card";

const PostComments = ({ postId }: { postId: number }) => {
  const [newComment, setNewComment] = useState("");
  const postComment = usePostComment();
  const session = useSessionStore((s) => s.session);
  const queryClient = useQueryClient();

  const { data: comments } = useFetchRecords({
    model: "Post_Comment",
    query: [{ key: "post", operator: "=", value: postId?.toString() }],
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(event.target.value);
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) {
      toast.error("Write something to post a comment!");
      return;
    }
    try {
      const res = await postComment.mutateAsync({
        post: postId,
        user: session?.user?.id,
        text: newComment,
      });
      setNewComment("");
      console.log("🚀 ~ handlePostComment ~ res:", res);
      toast.success("Comment added to a post!");
      queryClient.invalidateQueries({ queryKey: ["Post_Comment"] });
      queryClient.invalidateQueries({ queryKey: ["Post"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "");
    }
  };

  if (!postId) return <PostCommentSkeleton />;

  return (
    <Card className="relative w-full  bg-white rounded-md shadow-md border p-0">
      <CardContent className="sticky top-0 bg-white z-10 border-b p-0">
        <div className="flex items-center space-x-2 p-4">
          <Textarea
            value={newComment}
            onChange={handleInputChange}
            placeholder="Leave a comment..."
            className="resize-none shadow-sm flex-grow"
          />
          <div className="grid gap-1">
            <Button
              variant={"secondary"}
              onClick={handlePostComment}
              size={"sm"}
              className="h-10"
            >
              <Send />
            </Button>
            {/* <Button size={"sm"} variant={"secondary"}>
              <LucideUpload />
            </Button> */}
          </div>
        </div>
      </CardContent>

      <CardContent className="overflow-y-auto max-h-100 relative p-0">
        {comments?.length > 0 && (
          <CardTitle className="sticky top-0 bg-white p-2 px-4 z-1 flex items-center gap-2 pt-0 border-b border-gray-50">
            <MessageCircle size={20} /> Post Comments
          </CardTitle>
        )}
        <div className="space-y-4 p-4">
          {comments?.map((comment: any) => (
            <PostCommentCard key={comment.id} comment={comment} />
          ))}
          {comments?.length === 0 && (
            <p className="flex justify-center text-sm  text-gray-500">
              No comments yet. Be the first to share your thoughts!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PostComments;
