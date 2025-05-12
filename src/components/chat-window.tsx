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
import { handleSendMessageType, SessionType } from "@/schemas";
import { ArrowLeft, MoreVertical, Send, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ConversationSelector from "./conversation-selector";
import PieAvatar from "./pie-avatar";

import {
  ConversationType,
  fetchOrCreateConversationType,
  MessageType,
} from "@/schemas";
import toast from "react-hot-toast";

export default function ChatWindow({
  conversation,
  fetchOrCreateConversation,
  messages,
  message,
  setMessage,
  handleSendMessage,
  isMobile,
  onBack,
  session,
}: {
  conversation: ConversationType | null;
  fetchOrCreateConversation: fetchOrCreateConversationType;
  messages: MessageType[];
  message: string;
  setMessage: (msg: string) => void;
  handleSendMessage: handleSendMessageType;
  isMobile: boolean;
  onBack: () => void;
  session: SessionType;
}) {
  const [typing, setTyping] = useState<boolean | null>(null);
  const socket = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getMessage = (conversation: ConversationType) =>
    conversation?.messages?.at(-1);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (socket.current) {
      socket.current.close();
      socket.current = null;
    }
    if (conversation && !socket.current) {
      socket.current = new WebSocket(
        `ws://127.0.0.1:8000/ws/chat/${conversation?.id}/?token=${session?.token}`
      );
      const last_message = getMessage(conversation);
      const isReciepent = session?.user?.id !== last_message?.sender?.id;

      if (last_message && isReciepent) {
        sendSocketMessage({
          read_all: true,
          message_id: getMessage(conversation)?.id,
        });
      }
    }
  }, [conversation]);

  useEffect(() => {
    if (socket.current) {
      socket.current.onmessage = function (e) {
        const data = JSON.parse(e.data);
        console.log("🚀 ~ Socket ~ received data:", data);
        if (data.message && data.sender) {
          handleSendMessage(data);
        }
        if (
          data.typing !== undefined &&
          data?.user?.username !== session?.user?.username
        ) {
          setTyping(data.typing);
        }
      };

      socket.current.onclose = function () {
        console.info(`Chat socket with id-${conversation?.id} closed.`);
      };
    }
  }, [socket.current]);

  const sendSocketMessage = (data: any) => {
    if (socket.current?.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify(data));
    } else {
      socket.current?.addEventListener("open", () => {
        socket.current?.send(JSON.stringify(data));
      });
    }
  };
  const handleSubmitChat = () => {
    sendSocketMessage({ message });
  };

  const handleTyping = () => {
    sendSocketMessage({
      typing: true,
      sender: session?.user?.username,
    });
    setTimeout(() => {
      sendSocketMessage({
        typing: false,
        sender: session?.user?.username,
      });
    }, 2000);
  };

  if (!conversation) {
    return (
      <ConversationSelector createNewConversation={fetchOrCreateConversation} />
    );
  }

  return (
    <div className="w-full md:w-2/3 flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <PieAvatar participants={conversation.participants} />

          <div className="ms-3">
            <h2 className="font-semibold">
              {conversation?.participants
                ?.filter((u) => u?.id !== session?.user?.id)
                .map((p) => p.display_name)
                .join(", ")}
            </h2>
            <p className="text-xs text-gray-500">
              @
              {conversation.participants?.[0]?.username ||
                conversation.participants?.[0]?.email}
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
        {messages.map((msg) => (
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
