"use client";
import ChatWindow from "@/components/chat-window";
import ConversationList from "@/components/conversation-list";
import Header from "@/components/nav-header";
import { useCreateRecord } from "@/hooks/create-record";
import { useFetchRecords } from "@/hooks/fetch-records";
import { useMediaQuery } from "@/hooks/use-media-query";
import { getSession } from "@/hooks/use-session";
import { UserType } from "@/schemas";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

export default function ChatPage() {
  const { id } = useParams();
  const session = getSession();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [message, setMessage] = useState("");
  const [activeChat, setActiveChat] = useState<number | null>(
    id ? parseInt(id) : null
  );
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const createRecord = useCreateRecord();

  const { data: conversations } = useFetchRecords({
    model: "Conversation",
  });

  useEffect(() => {
    if (activeChat) {
      setChatMessages([]);
    }
  }, [activeChat]);

  useEffect(() => {
    if (id) {
      setActiveChat(parseInt(id));
      if (isMobile) setShowSidebar(false);
    }
  }, [id, isMobile]);

  const handleSendMessage = (data: { message: string; sender: UserType }) => {
    const newMessage = {
      id: chatMessages.length + 1,
      text: data.message,
      sender: data.sender,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setChatMessages((prev) => [...prev, newMessage]);
    if (data.sender?.id === session?.user?.id) {
      setMessage("");
    }
  };

  const createNewConversation = async (participants: UserType[]) => {
    try {
      const data = await createRecord.mutateAsync({
        participants: participants?.map((u) => u?.id),
      });
      setActiveChat(data?.id);
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const activeConversation = conversations?.find((c) => c.id === activeChat);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Header />
      <div className="container mx-auto px-4 py-6 max-w-6xl h-[calc(100vh-80px)]">
        <div className="flex h-full border rounded-lg overflow-hidden">
          {(showSidebar || !isMobile) && (
            <ConversationList
              conversations={conversations}
              createNewConversation={createNewConversation}
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
              createNewConversation={createNewConversation}
              messages={chatMessages}
              message={message}
              setMessage={setMessage}
              onSendMessage={handleSendMessage}
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
