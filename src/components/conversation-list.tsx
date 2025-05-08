import { UserType } from "@/schemas";
import { Plus } from "lucide-react";
import NewChatDialog from "./new-chat-dialog";
import PieAvatar from "./pie-avatar";

type ConversationListProps = {
  conversations?: {
    id: number;
    participants: { display_name: string }[];
    created_at: string;
  }[];
  createNewConversation: (participants: UserType[]) => void;
  activeChat: number | null;
  onSelectChat: (id: number) => void;
};

export default function ConversationList({
  conversations,
  createNewConversation,
  activeChat,
  onSelectChat,
}: ConversationListProps) {
  return (
    <div className="w-full md:w-1/3 border-r bg-gray-50 dark:bg-gray-950">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Messages</h2>
          <div className="">
            <NewChatDialog
              createNewConversation={createNewConversation}
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
        {conversations?.map((conversation) => (
          <div
            key={conversation.id}
            className={`flex items-center p-3 border-b cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 ${
              activeChat === conversation.id
                ? "bg-gray-100 dark:bg-gray-900"
                : ""
            }`}
            onClick={() => onSelectChat(conversation.id)}
          >
            <PieAvatar participants={conversation.participants} />

            <div className="ml-3 flex-1 min-w-0">
              <p className="font-medium truncate">
                {conversation.participants
                  .map((p) => p.display_name)
                  .join(", ")}
              </p>
              <p className="text-xs text-gray-500">
                {conversation.created_at &&
                  `${new Date(
                    conversation.created_at
                  ).toDateString()} ${new Date(
                    conversation.created_at
                  ).toLocaleTimeString()}`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
