import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { extractDate } from "@/lib/utils";
import { ArrowLeft, MoreVertical, Send, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useFetchRecords } from "@/hooks/fetch-records";
import { useSessionStore } from "@/lib/sessionStore";
import { ActiveChatType } from "@/pages/Chat";
import { MessageType, UserType } from "@/schemas";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useChatSocket } from "./chat-scoket-context";
import ConversationSelector from "./conversation-selector";
import { useConversationSocket } from "./conversation-socket-context";
import PieAvatar from "./pie-avatar";

export default function ChatWindow({
  onBack,
  activeChat,
}: {
  onBack: () => void;
  activeChat: ActiveChatType;
}) {
  const socket = useChatSocket();
  const conversationSocket = useConversationSocket();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const session = useSessionStore((s) => s.session);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [typing, setTyping] = useState<boolean | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { data: conversations } = useFetchRecords({
    model: "Conversation",
    query: [{ key: "id", operator: "=", value: activeChat }],
    enabled: !!activeChat,
  });

  const { data: messages } = useFetchRecords({
    model: "Message",
    query: [{ key: "conversation", operator: "=", value: activeChat }],
    enabled: !!activeChat,
  });
  const conversation = conversations?.[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("🚀 ~ useEffect ~ data:", data);
        if (data.message) {
          conversationSocket?.send(
            JSON.stringify({
              conversation_id: activeChat,
            })
          );
          queryClient.invalidateQueries({ queryKey: ["Message"] });
        }
        if (data.typing && data.user?.id !== session?.user?.id) {
          setTyping(true);
          timerRef.current = setTimeout(() => {
            setTyping(false);
          }, 3000);
        }
      };
    }
  }, [socket]);

  const handleSubmitChat = async () => {
    socket?.send(
      JSON.stringify({
        message,
        sender: session?.user?.id,
      })
    );
    setMessage("");
  };

  const handleTyping = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    socket?.send(
      JSON.stringify({
        typing: true,
      })
    );
  };

  if (!activeChat) {
    return <ConversationSelector />;
  }

  return (
    <div className="w-full md:w-2/3 flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <PieAvatar participants={conversation?.participants} />

          <div className="ms-3">
            <h2 className="font-semibold">
              {conversation?.participants
                ?.filter((u: UserType) => u?.id !== session?.user?.id)
                .map((p: UserType) => p.display_name)
                .join(", ")}
            </h2>
            <p className="text-xs text-gray-500">
              @
              {conversation?.participants?.[0]?.username ||
                conversation?.participants?.[0]?.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              toast("Not available, this feature is coming soon...")
            }
          >
            <Video className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View profile</DropdownMenuItem>
              <DropdownMenuItem>Block user</DropdownMenuItem>
              <DropdownMenuItem>Clear chat history</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500">
                Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map((msg: MessageType) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender?.id === session?.user?.id
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                msg.sender?.id === session?.user?.id
                  ? "bg-gray-100 dark:bg-gray-900"
                  : "bg-gray-200 dark:bg-gray-800"
              }`}
            >
              <p className="break-words whitespace-pre-wrap">{msg.content}</p>
              <p className="text-xs text-gray-500 mt-1 text-right">
                {extractDate(msg.timestamp)}
              </p>
            </div>
          </div>
        ))}
        {typing !== null && typing && (
          <div className="flex justify-start">
            <div className="max-w-[70%] rounded-lg px-4 py-2 bg-gray-200 dark:bg-gray-800">
              <p className="text-xs text-gray-500">Typing...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center">
          <Input
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmitChat()}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button
            onClick={handleSubmitChat}
            disabled={!message.trim()}
            className="ml-2"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
