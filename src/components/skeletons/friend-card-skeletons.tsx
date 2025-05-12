"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, UserPlus } from "lucide-react";

export default function FriendCardSkeleton({
  isMobile,
}: {
  isMobile: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-200 dark:border-gray-800 p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-950">
      <div className="flex items-center gap-3 min-w-0">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-1">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size={isMobile ? "sm" : "sm"}
          variant="outline"
          disabled
          className="border-gray-200 dark:border-gray-800 flex-shrink-0"
        >
          <MessageSquare
            className={`${isMobile ? "h-4 w-4" : "mr-2 h-4 w-4"}`}
          />
          {!isMobile && "Message"}
        </Button>

        <Button
          size={isMobile ? "sm" : "default"}
          variant="outline"
          disabled
          className="border-gray-200 dark:border-gray-800 flex-shrink-0"
        >
          <UserPlus className={`${isMobile ? "h-4 w-4" : "mr-2 h-4 w-4"}`} />
          {!isMobile && "Follow"}
        </Button>
      </div>
    </div>
  );
}
