import { Plus } from "lucide-react";
import NewChatDialog from "./new-chat-dialog";
import PieAvatar from "./pie-avatar";

import { useSessionStore } from "@/lib/sessionStore";
import { extractDate } from "@/lib/utils";
import { ConversationType, fetchOrCreateConversationType } from "@/schemas";

export default function ConversationList({
  conversations,
  fetchOrCreateConversation,
  activeChat,
  onSelectChat,
}: {
  conversations: ConversationType[];
  fetchOrCreateConversation: fetchOrCreateConversationType;
  activeChat: string | null;
  onSelectChat: (id: string) => void;
}) {
  const session = useSessionStore((state) => state.session);

  const getParticipantsName = (conversation: ConversationType) => {
    return conversation?.participants
      ?.filter((u) => u?.id !== session?.user?.id)
      .map((p) => p.display_name || p.username)
      .join(", ");
  };

  const getMessageTime = (conversation: ConversationType) => {
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

  return (
    <div className="w-full md:w-1/3 border-r bg-gray-50 dark:bg-gray-950">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Messages</h2>
          <div className="">
            <NewChatDialog
              createNewConversation={fetchOrCreateConversation}
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
            onClick={() => onSelectChat(conversation?.id)}
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
                  {getMessageTime(conversation)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
