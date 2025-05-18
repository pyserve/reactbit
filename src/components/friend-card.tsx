"use client";

import { Button } from "@/components/ui/button";
import { useConnectUser } from "@/hooks/connect-user";
import { useFetchRecords } from "@/hooks/fetch-records";
import { useSessionStore } from "@/lib/sessionStore";
import { Loader2, UserMinus, UserPlus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaFacebookMessenger } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import FriendCardSkeleton from "./skeletons/friend-card-skeletons";
import { useSocket } from "./socket-context";
import UserAvatar from "./user-avatar";

export default function FriendCard({
  userId,
  actionType,
  isMobile,
}: {
  userId: number;
  actionType: string;
  isMobile: boolean;
}) {
  const [IsLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const connectUser = useConnectUser();
  const session = useSessionStore((state) => state.session);
  const setSession = useSessionStore((state) => state.setSession);
  const notificationSocket = useSocket();
  const { data: user, isFetched } = useFetchRecords({
    model: "User",
    query: [
      {
        key: "id",
        operator: "=",
        value: userId,
      },
    ],
  });

  const handleMessageClick = () => {
    navigate(`/chat/${userId}`);
  };

  const onAction = async () => {
    if (!session) return;
    setIsLoading(true);
    let message = "";
    if (actionType === "follow") {
      message = "You have successfully followed this user!";
    } else if (actionType === "unfollow") {
      message = "You have successfully unfollowed this user?.";
    }
    try {
      const updatedUser = await connectUser.mutateAsync({
        current: session?.user,
        other: user?.[0],
        actionType,
      });
      if (actionType === "follow" && user?.[0]?.id !== session?.user?.id) {
        notificationSocket?.send(
          JSON.stringify({
            recipient: user?.[0]?.id,
            sender: session?.user?.id,
            model: "user",
            record_id: user?.[0]?.id,
            notification_type: "follow",
            message: `${session?.user?.username} started following you`,
          })
        );
      }
      setSession(session.token, updatedUser);
      toast.success(message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isFetched) return <FriendCardSkeleton isMobile={isMobile} />;

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-200 dark:border-gray-800 p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-950">
      <div className="flex items-center gap-3 min-w-0">
        <UserAvatar user={user?.[0]} />
        <div className="min-w-0">
          <Link
            to={`/profile/${user?.[0]?.username}`}
            className="font-medium hover:underline text-black dark:text-white truncate block"
          >
            {(user?.[0]?.first_name ?? "User") + " " + user?.[0]?.last_name}
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {user?.[0]?.email ||
              (user?.[0]?.username ? `@${user?.[0]?.username}` : null)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size={isMobile ? "sm" : "sm"}
          variant="outline"
          onClick={handleMessageClick}
          className="border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 flex-shrink-0"
        >
          <FaFacebookMessenger />
          {!isMobile && "Message"}
        </Button>

        {actionType === "follow" && (
          <Button
            size={isMobile ? "sm" : "default"}
            variant="outline"
            onClick={onAction}
            className="border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 flex-shrink-0"
          >
            {IsLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <UserPlus
                className={`${isMobile ? "h-4 w-4" : "mr-2 h-4 w-4"}`}
              />
            )}
            {!isMobile && "Follow"}
          </Button>
        )}
        {actionType === "unfollow" && (
          <Button
            size={isMobile ? "sm" : "default"}
            variant="outline"
            onClick={onAction}
            className="border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 flex-shrink-0"
          >
            {IsLoading ? <Loader2 /> : ""}
            {isMobile ? <UserMinus /> : "Unfollow"}
          </Button>
        )}
        {actionType === "following" && (
          <Button
            size={isMobile ? "sm" : "default"}
            variant="secondary"
            disabled
            className="flex-shrink-0 bg-gray-100 dark:bg-gray-900 text-gray-500"
          >
            {isMobile ? "✓" : "Following"}
          </Button>
        )}
      </div>
    </div>
  );
}
