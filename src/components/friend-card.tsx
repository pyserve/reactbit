"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FriendCard({
  user,
  actionType,
  onAction,
  isMobile,
}: {
  user: Record<string, any>;
  actionType: string;
  onAction: () => void;
  isMobile: boolean;
}) {
  const navigate = useNavigate();

  const handleMessageClick = () => {
    navigate(`/chat/${user.id}`);
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-200 dark:border-gray-800 p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-950">
      <div className="flex items-center gap-3 min-w-0">
        <Avatar className="border border-gray-200 dark:border-gray-800 h-10 w-10">
          <AvatarImage
            src={user.avatar || "/placeholder.svg"}
            alt={user.name}
          />
          <AvatarFallback className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            {user.name.charAt(0)}
            {user.name.split(" ")[1]?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <a
            href={`/profile/${user.username}`}
            className="font-medium hover:underline text-black dark:text-white truncate block"
          >
            {user.name}
          </a>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            @{user.username}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size={isMobile ? "sm" : "default"}
          variant="outline"
          onClick={handleMessageClick}
          className="border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 flex-shrink-0"
        >
          <MessageSquare
            className={`${isMobile ? "h-4 w-4" : "mr-2 h-4 w-4"}`}
          />
          {!isMobile && "Message"}
        </Button>

        {actionType === "follow" && (
          <Button
            size={isMobile ? "sm" : "default"}
            variant="outline"
            onClick={onAction}
            className="border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 flex-shrink-0"
          >
            <UserPlus className={`${isMobile ? "h-4 w-4" : "mr-2 h-4 w-4"}`} />
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
            {isMobile ? "Unfollow" : "Unfollow"}
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
