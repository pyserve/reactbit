import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { UserType } from "@/schemas";
import { ArrowLeft, MoreVertical, Send, Video } from "lucide-react";
import { useEffect, useState } from "react";
import ConversationSelector from "./conversation-selector";
import PieAvatar from "./pie-avatar";

export type ConversationType =
  | {
      id: number;
      image?: string;
      participants: {
        display_name: string;
        username?: string;
        email?: string;
      }[];
    }
  | undefined;

export type ChatWindowProps = {
  conversation: ConversationType;
  createNewConversation: (participants: UserType[]) => void;
  messages: { id: number; text: string; sender: string; timestamp: string }[];
  message: string;
  setMessage: (msg: string) => void;
  onSendMessage: (data: { message: string; sender: UserType }) => void;
  isMobile: boolean;
  onBack: () => void;
  session: any;
};

export default function ChatWindow({
  conversation,
  createNewConversation,
  messages,
  message,
  setMessage,
  onSendMessage,
  isMobile,
  onBack,
  session,
}: ChatWindowProps) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [typing, setTyping] = useState<boolean | null>(null);

  useEffect(() => {
    if (conversation) {
      const chatSocket = new WebSocket(
        `ws://127.0.0.1:8000/ws/chat/${conversation?.id}/?token=${session.token}`
      );
      setSocket(chatSocket);
    }
    return () => setSocket(null);
  }, [conversation]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = function (e) {
        const data = JSON.parse(e.data);
        if (data.message && data.sender) {
          onSendMessage(data);
        }
        if (
          data.typing !== undefined &&
          data?.user?.username !== session?.user?.username
        ) {
          setTyping(data.typing);
        }
      };

      socket.onclose = function () {
        console.error("Chat socket closed unexpectedly");
      };
    }
  }, [socket, session.user]);

  const handleSubmitChat = () => {
    socket?.send(
      JSON.stringify({
        message: message,
      })
    );
  };

  const handleTyping = () => {
    socket?.send(
      JSON.stringify({
        typing: true,
        sender: session?.user?.username,
      })
    );
    setTimeout(() => {
      socket?.send(
        JSON.stringify({
          typing: false,
          sender: session?.user?.username,
        })
      );
    }, 2000);
  };

  if (!conversation) {
    return (
      <ConversationSelector
        createNewConversation={createNewConversation}
        followers={session?.user?.followers}
        following={session?.user?.following}
      />
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
              {conversation.participants.map((p) => p.display_name).join(", ")}
            </h2>
            <p className="text-xs text-gray-500">
              @
              {conversation.participants?.[0]?.username ||
                conversation.participants?.[0]?.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
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
              <p>{msg.text}</p>
              <p className="text-xs text-gray-500 mt-1 text-right">
                {msg.timestamp}
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
