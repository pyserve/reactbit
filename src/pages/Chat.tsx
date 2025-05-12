"use client";
import ChatWindow from "@/components/chat-window";
import ConversationList from "@/components/conversation-list";
import Header from "@/components/nav-header";
import { useCreateRecord } from "@/hooks/create-record";
import { useFetchRecords } from "@/hooks/fetch-records";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useSessionStore } from "@/lib/sessionStore";
import { ConversationType, handleSendMessageType, UserType } from "@/schemas";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

dayjs.extend(utc);

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const session = useSessionStore((state) => state.session);

  const createRecord = useCreateRecord();
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const socket = useRef<WebSocket | null>(null);

  const [message, setMessage] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(id ? id : null);
  const { data: conversations } = useFetchRecords({ model: "Conversation" });
  const [activeConversation, setActiveConversation] =
    useState<ConversationType | null>(null);

  useEffect(() => {
    if (session?.user && !socket.current) {
      socket.current = new WebSocket(
        `ws://127.0.0.1:8000/ws/conversation/${session.user?.id}/?token=${session.token}`
      );
    }
  }, [session]);

  useEffect(() => {
    if (socket.current) {
      socket.current.onmessage = async function (e) {
        const data = JSON.parse(e.data);
        console.log("🚀 ~ Socket ~ data:", data);
        queryClient.invalidateQueries({ queryKey: ["Conversation"] });
      };
    }
  }, [socket.current]);

  useEffect(() => {
    if (!conversations || !activeChat) return;
    if (!activeConversation || activeConversation?.id !== activeChat) {
      const conv = conversations.find(
        (c: ConversationType) => c.id === activeChat
      );
      if (conv) setActiveConversation(conv);
    }
  }, [conversations, activeChat]);

  useEffect(() => {
    if (id) {
      setActiveChat(id);
      if (isMobile) setShowSidebar(false);
    }
  }, [id, isMobile]);

  const handleSendMessage: handleSendMessageType = async (data) => {
    try {
      const newMessage = {
        id: uuidv4(),
        conversation: activeChat,
        content: data.message,
        sender: data.sender,
        timestamp: dayjs().utc().format("YYYY-MM-DDTHH:mm:ss.SSS000[Z]"),
      };
      setChatMessages((prev) => [...prev, newMessage]);
      if (socket.current?.readyState === WebSocket.OPEN) {
        socket.current.send(JSON.stringify(data));
      }
    } catch (error: any) {
      toast.error(error.message);
    }
    if (data.sender?.id === session?.user?.id) {
      setMessage("");
    }
  };

  const fetchOrCreateConversation = async (participants: UserType[]) => {
    try {
      const data = await createRecord.mutateAsync({
        url: "/conversations/",
        data: { participants: participants?.map((u) => u?.id) },
      });
      setChatMessages(data.messages);

      setActiveChat(data?.id);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (activeConversation) {
      setChatMessages(activeConversation.messages);
    }
  }, [activeConversation]);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Header />
      <div className="container mx-auto px-4 py-6 max-w-6xl h-[calc(100vh-80px)]">
        <div className="flex h-full border rounded-lg overflow-hidden">
          {(showSidebar || !isMobile) && (
            <ConversationList
              conversations={conversations || []}
              fetchOrCreateConversation={fetchOrCreateConversation}
              activeChat={activeChat}
              onSelectChat={(id) => {
                setActiveChat(id);
                if (isMobile) setShowSidebar(false);
              }}
            />
          )}
          {(!showSidebar || !isMobile) && (
            <ChatWindow
              conversation={activeConversation}
              fetchOrCreateConversation={fetchOrCreateConversation}
              messages={chatMessages}
              message={message}
              setMessage={setMessage}
              handleSendMessage={handleSendMessage}
              isMobile={isMobile}
              onBack={() => setShowSidebar(true)}
              session={session}
            />
          )}
        </div>
      </div>
    </div>
  );
}
