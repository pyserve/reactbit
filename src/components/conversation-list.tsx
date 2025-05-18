import { Plus } from "lucide-react";
import NewChatDialog from "./new-chat-dialog";
import PieAvatar from "./pie-avatar";

import { useFetchRecords } from "@/hooks/fetch-records";
import { useSessionStore } from "@/lib/sessionStore";
import { extractDate } from "@/lib/utils";
import { ConversationType } from "@/schemas";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useConversationSocket } from "./conversation-socket-context";
import { useSocket } from "./socket-context";

export default function ConversationList({
  activeChat,
  onSelectChat,
}: {
  activeChat: string | null;
  onSelectChat: (id: string) => void;
}) {
  const socket = useConversationSocket();
  const notificationSocket = useSocket();
  const queryClient = useQueryClient();
  const session = useSessionStore((state) => state.session);
  const { data: conversations } = useFetchRecords({ model: "Conversation" });

  const getParticipantsName = (conversation: ConversationType) => {
    return conversation?.participants
      ?.filter((u) => u?.id !== session?.user?.id)
      .map((p) => p.display_name || p.username)
      .join(", ");
  };

  const getLastMessageTime = (conversation: ConversationType) => {
    return (
      conversation?.messages.length > 0 &&
      conversation.messages[conversation.messages.length - 1] &&
      extractDate(
        conversation.messages[conversation.messages.length - 1].timestamp
      )
    );
  };

  const getMessage = (conversation: ConversationType) => {
    return conversation?.messages?.at(-1);
  };

  const isNewMessage = (conversation: ConversationType) => {
    const last_message = conversation?.messages?.at(-1);
    return (
      last_message?.conversation !== activeChat &&
      last_message?.sender?.id !== session?.user?.id &&
      last_message &&
      !last_message?.is_read
    );
  };

  const isActiveChat = (
    activeChat: string | null,
    conversation: ConversationType
  ) => {
    return activeChat == conversation?.id ? "bg-white" : "bg-gray-100";
  };

  const markReadConversation = (conversationId: string) => {
    socket?.send(
      JSON.stringify({
        conversation_id: conversationId,
        read_all: true,
      })
    );
  };

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("🚀 ~ useEffect ~ data:", data);
        queryClient.invalidateQueries({ queryKey: ["Conversation"] });
      };
    }
  }, [socket]);

  useEffect(() => {
    if (!notificationSocket) return;
    notificationSocket.onmessage = async (e) => {
      const data = JSON.parse(e.data);
      console.log("🚀 ~ notificationSocket.onmessage= ~ data:", data);
      queryClient.invalidateQueries({ queryKey: ["Notification"] });
    };
  }, [notificationSocket]);

  return (
    <div className="w-full md:w-1/3 border-r bg-gray-50 dark:bg-gray-950">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Messages</h2>
          <div className="">
            <NewChatDialog
              trigger={
                <>
                  <Plus />
                  New Chat
                </>
              }
            />
          </div>
        </div>
      </div>
      <div className="overflow-y-auto h-[calc(100%-60px)]">
        {conversations?.map((conversation: ConversationType) => (
          <div
            key={conversation?.id}
            className={`flex items-center p-3 border-b cursor-pointer hover:bg-gray-50 ${isActiveChat(
              activeChat,
              conversation
            )}`}
            onClick={() => {
              onSelectChat(conversation?.id);
              markReadConversation(conversation.id);
            }}
          >
            <PieAvatar participants={conversation?.participants ?? []} />

            <div className="ml-3 flex-1 min-w-0">
              <p className="font-medium truncate">
                {getParticipantsName(conversation)}
              </p>
              <div className="flex items-center justify-between">
                <div
                  className={`text-xs truncate max-w-[calc(100%_-_85px)] ${
                    isNewMessage(conversation) ? "font-bold" : ""
                  }`}
                >
                  {getMessage(conversation)?.content ?? "No Message"}
                </div>
                <p className="text-xs text-[11px] text-gray-500">
                  {getLastMessageTime(conversation)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
