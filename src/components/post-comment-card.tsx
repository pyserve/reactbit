import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirmDialog } from "@/hooks/async-alert-dialog";
import { useFetchRecords } from "@/hooks/fetch-records";
import { api } from "@/lib/api";
import { useSessionStore } from "@/lib/sessionStore";
import { extractDate } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Dot, Edit, MoreVertical, Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSocket } from "../contexts/socket-context";
import PostCommentCardSkeleton from "./skeletons/post-comment-card-skeleton";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import UserAvatar from "./user-avatar";

export default function PostCommentCard({
  comment,
  postUser,
}: {
  comment: any;
  postUser?: number;
}) {
  const queryClient = useQueryClient();
  const { confirmDialog } = useConfirmDialog();
  const session = useSessionStore((s) => s.session);
  const [IsEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment?.text);
  const notificationSocket = useSocket();

  const { data: users } = useFetchRecords({
    model: "User",
    query: [{ key: "id", operator: "=", value: comment?.user }],
  });

  const user = users?.[0];

  const EditComment = async () => {
    console.log("🚀 ~ EditComment ~ ok:", editedComment);
    try {
      const res = await api.patch(`/post_comments/${comment?.id}/`, {
        text: editedComment,
      });
      console.log("🚀 ~ EditComment ~ res:", res);
      setEditedComment(res.data?.text);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error");
    } finally {
      setIsEditing(false);
    }
  };

  const DeleteComment = async () => {
    try {
      const ok = await confirmDialog({});
      if (!ok) throw new Error("Operation cancelled!");
      const res = await api.delete(`/post_comments/${comment?.id}/`);
      console.log("🚀 ~ DeleteComment ~ res:", res);
      toast.success(`Comment ${comment?.id} deleted successfully!`);
      notificationSocket?.send(
        JSON.stringify({
          deleted: postUser,
        })
      );
      queryClient.invalidateQueries({ queryKey: ["Post_Comment"] });
      queryClient.invalidateQueries({ queryKey: ["Post"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error");
    }
  };

  if (!comment) return <PostCommentCardSkeleton />;

  return (
    <div>
      <div key={comment.id} className="flex space-x-3">
        <UserAvatar user={user || comment.user} />
        <div className="">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 ">
              <div className="text-sm font-semibold">{user?.display_name}</div>
              <div className={user?.display_name && `text-sm`}>
                @{user?.username || user?.email}
              </div>
              <div>
                <Dot />
              </div>
              <div className="text-xs text-gray-500">
                {extractDate(comment?.created_at?.toString())}
              </div>
            </div>

            {session?.user?.id === user?.id && (
              <div className="">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded hover:bg-gray-100">
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={DeleteComment}>
                      <Trash className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
          <div className="mt-1 text-sm">
            {IsEditing ? (
              <div className="flex flex-col gap-1">
                <Textarea
                  value={editedComment}
                  onChange={(e) => setEditedComment(e.target.value)}
                ></Textarea>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant={"ghost"}
                    onClick={() => setIsEditing(false)}
                    size={"sm"}
                    className="bg-red-400 text-gray-900"
                  >
                    Cancel
                  </Button>
                  <Button onClick={EditComment} size={"sm"}>
                    Post
                  </Button>
                </div>
              </div>
            ) : (
              editedComment
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
