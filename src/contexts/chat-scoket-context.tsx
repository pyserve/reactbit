// ChatSocketContext.tsx
import { SessionType } from "@/schemas";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import * as pkg from "../../package.json";

type ChatSocketContextType = WebSocket | null;
const ChatSocketContext = createContext<ChatSocketContextType>(null);

export const useChatSocket = (): ChatSocketContextType => {
  return useContext(ChatSocketContext);
};

interface ChatSocketProviderProps {
  session: SessionType | null;
  conversationId: string | null;
  children: ReactNode;
}

export const ChatSocketProvider: React.FC<ChatSocketProviderProps> = ({
  session,
  conversationId,
  children,
}) => {
  const [chatSocket, setChatSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (session?.token && conversationId) {
      const ws = new WebSocket(
        `ws://${pkg.backend_host}/ws/chat/${conversationId}/?token=${session.token}`
      );

      ws.onopen = () => {
        console.log("✅ Chat WebSocket connected");
        setChatSocket(ws);
      };

      ws.onclose = () => {
        console.log("❌ Chat WebSocket disconnected");
        setChatSocket(null);
      };

      ws.onerror = (error) => {
        console.error("Chat WebSocket error:", error);
      };

      return () => {
        ws.close();
        setChatSocket(null);
      };
    } else {
      setChatSocket(null);
    }
  }, [session, conversationId]);

  return (
    <ChatSocketContext.Provider value={chatSocket}>
      {children}
    </ChatSocketContext.Provider>
  );
};
