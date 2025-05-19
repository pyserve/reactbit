import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useFetchRecords } from "@/hooks/fetch-records";
import { useUpdateRecord } from "@/hooks/update-record";
import { api } from "@/lib/api";
import { useSessionStore } from "@/lib/sessionStore";
import { extractDate } from "@/lib/utils";
import { NotificationType } from "@/schemas";
import {
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import {
  BellDot,
  BellIcon,
  CheckCircleIcon,
  MessageCircle,
  Settings,
  ThumbsUp,
  Trash2,
  UserPlus2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import UserAvatar from "./user-avatar";

export default function Notification() {
  const navigate = useNavigate();
  const [openNotification, setOpenNotification] = useState(false);
  const session = useSessionStore((s) => s.session);
  const updateRecord = useUpdateRecord();
  const queryClient = useQueryClient();

  const { data: notifications } = useFetchRecords({
    model: "Notification",
    query: [
      {
        key: "recipient",
        operator: "=",
        value: session?.user?.id,
      },
      {
        key: "notification_type__ne",
        operator: "=",
        value: "message",
      },
    ],
  });

  const unreadNotifications = notifications?.filter(
    (n: NotificationType) => !n.is_read
  );

  const readNotification = async (records: NotificationType[]) => {
    try {
      for (let index = 0; index < records.length; index++) {
        const record = records[index];
        await updateRecord.mutateAsync({
          model: "Notification",
          recordId: record?.id,
          data: {
            is_read: true,
          },
        });
      }
      queryClient.invalidateQueries({ queryKey: ["Notification"] });
    } catch (error) {
      console.log("🚀 ~ readNotification ~ error:", error);
    }
  };

  const deleteNotification = async (recordId: number) => {
    try {
      const res = await api.delete(`/notifications/${recordId}/`);
      console.log("🚀 ~ deleteNotification ~ res:", res);
      queryClient.invalidateQueries({ queryKey: ["Notification"] });
      toast.success("Notification deleted sucessfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error");
    }
  };

  useEffect(() => {
    if (openNotification) {
      setTimeout(() => {
        readNotification(unreadNotifications);
      }, 5000);
    }
  }, [openNotification]);

  return (
    <DropdownMenu open={openNotification} onOpenChange={setOpenNotification}>
      <div className="relative">
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center px-0 py-0 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-0 dark:bg-gray-800"
          >
            <BellIcon className="w-5 h-5 " />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-auto">
          <DropdownMenuLabel className="py-1 font-semibold flex justify-between items-center">
            <div className="flex gap-1 items-center ">
              <BellDot size={16} />
              <span>Notifications</span>
            </div>
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <span className="text-xs">More</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onClick={() =>
                        toast.success("All notificated marked read!")
                      }
                    >
                      <span>Mark all as read</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
          </DropdownMenuLabel>
          <Tabs defaultValue="all" className="min-w-[300px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
            </TabsList>
            <DropdownMenuSeparator />
            <TabsContent value="all">
              {notifications?.length === 0 && (
                <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                  <CheckCircleIcon className="w-6 h-6 text-green-500 mb-2" />
                  <span className="text-sm font-medium text-center">
                    You're all caught up! 🎉
                    <br />
                    We'll let you know when something happens.
                  </span>
                </div>
              )}
              {notifications?.map((notification: NotificationType) => {
                return (
                  <DropdownMenuItem
                    key={notification?.id}
                    className="relative group items-start cursor-pointer bg-gray-50 hover:bg-gray-100 mb-1 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <UserAvatar user={notification.sender} />
                    <div>
                      <div className="">{notification.message}.</div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-xs py-1 flex items-center gap-2">
                          <div className="">
                            {notification.notification_type === "like" && (
                              <ThumbsUp className="h-4 w-4 text-green-500" />
                            )}
                            {notification.notification_type === "comment" && (
                              <MessageCircle className="h-4 w-4 text-orange-500" />
                            )}
                            {notification.notification_type === "follow" && (
                              <UserPlus2Icon className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                          {extractDate(notification.created_at)}
                        </div>
                        <div
                          className="hidden group-hover:flex gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <div
                            className="p-1 hover:bg-white rounded-full"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="w-5 h-5 text-red-700" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </TabsContent>
            <TabsContent value="unread">
              {unreadNotifications?.length === 0 && (
                <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                  <CheckCircleIcon className="w-6 h-6 text-green-500 mb-2" />
                  <span className="text-sm font-medium text-center">
                    No any unread notification!
                  </span>
                </div>
              )}
              {unreadNotifications?.map((notification: NotificationType) => {
                return (
                  <DropdownMenuItem
                    key={notification?.id}
                    className="items-start cursor-pointer bg-gray-50 hover:bg-gray-100 mb-1 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <UserAvatar user={notification.sender} />
                    <div>
                      <div className="capitalize">
                        {notification.sender?.username} {notification.message}
                      </div>
                      <div className="text-xs">
                        {extractDate(notification.created_at)}
                      </div>
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </TabsContent>
          </Tabs>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => navigate("/settings/")}
            className="cursor-pointer"
          >
            <Settings className="mr-2 h-4 w-4" />
            Notification Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
        {unreadNotifications?.length > 0 && (
          <span className="absolute bottom-6 left-5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            {unreadNotifications?.length}
          </span>
        )}
      </div>
    </DropdownMenu>
  );
}
