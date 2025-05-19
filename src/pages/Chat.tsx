"use client";
import ChatWindow from "@/components/chat-window";
import ConversationList from "@/components/conversation-list";
import Header from "@/components/nav-header";
import { ChatSocketProvider } from "@/contexts/chat-scoket-context";
import { ConversationSocketProvider } from "@/contexts/conversation-socket-context";
import { useSessionStore } from "@/lib/sessionStore";
import { useState } from "react";

export type ActiveChatType = string | null;

export default function ChatPage() {
  // const { id } = useParams<{ id: string }>();
  const session = useSessionStore((state) => state.session);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeChat, setActiveChat] = useState<ActiveChatType>(null);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Header />
      <ConversationSocketProvider session={session}>
        <div className="container mx-auto px-4 py-6 max-w-6xl h-[calc(100vh-80px)]">
          <div className="flex h-full border rounded-lg overflow-hidden">
            {showSidebar && (
              <ConversationList
                activeChat={activeChat}
                onSelectChat={(id) => {
                  setActiveChat(id);
                }}
              />
            )}

            <ChatSocketProvider session={session} conversationId={activeChat}>
              <ChatWindow
                activeChat={activeChat}
                onBack={() => setShowSidebar(true)}
              />
            </ChatSocketProvider>
          </div>
        </div>
      </ConversationSocketProvider>
    </div>
  );
}
