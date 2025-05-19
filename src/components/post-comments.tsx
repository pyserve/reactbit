import { Textarea } from "@/components/ui/textarea";
import { useFetchRecords } from "@/hooks/fetch-records";
import { usePostComment } from "@/hooks/post-engagement";
import { useSessionStore } from "@/lib/sessionStore";
import { PostType } from "@/schemas";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSocket } from "../contexts/socket-context";
import PostCommentCard from "./post-comment-card";
import PostCommentSkeleton from "./skeletons/post-comment-skeleton";
import { Card, CardContent } from "./ui/card";

const PostComments = ({ post }: { post: PostType }) => {
  const [newComment, setNewComment] = useState("");
  const postComment = usePostComment();
  const session = useSessionStore((s) => s.session);
  const queryClient = useQueryClient();
  const notificationSocket = useSocket();

  const { data: comments } = useFetchRecords({
    model: "Post_Comment",
    query: [{ key: "post", operator: "=", value: post?.id?.toString() }],
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
        post_id: post?.id,
        user: session?.user?.id,
        text: newComment,
      });
      setNewComment("");
      console.log("🚀 ~ handlePostComment ~ res:", res);
      toast.success("Comment added to a post!");
      if (post?.user !== session?.user?.id) {
        notificationSocket?.send(
          JSON.stringify({
            recipient: post?.user,
            sender: session?.user?.id,
            model: "postcomment",
            record_id: res?.id,
            notification_type: "comment",
            message: `${session?.user?.username} commented on your post ${post.id}`,
          })
        );
      }
      queryClient.invalidateQueries({ queryKey: ["Post_Comment"] });
      queryClient.invalidateQueries({ queryKey: ["Post"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "");
    }
  };

  if (!post) return <PostCommentSkeleton />;

  return (
    <Card className="relative gap-0 p-0 rounded-se-none rounded-ss-none border-t-0">
      <CardContent className="px-4 py-2">
        <div className="flex items-center">
          <Textarea
            value={newComment}
            onChange={handleInputChange}
            placeholder="Leave a comment..."
            className="resize-none flex-grow"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handlePostComment();
              }
            }}
          />
        </div>
      </CardContent>

      <CardContent className="overflow-y-auto max-h-100 relative p-0">
        <div className="space-y-4 p-4">
          {comments?.map((comment: any) => (
            <PostCommentCard
              key={comment.id}
              postUser={post.user}
              comment={comment}
            />
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
