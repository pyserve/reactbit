// ConversationSocketContext.tsx
import { SessionType } from "@/schemas";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import * as pkg from "../../package.json";

type ConversationSocketContextType = WebSocket | null;
const ConversationSocketContext =
  createContext<ConversationSocketContextType>(null);

export const useConversationSocket = (): ConversationSocketContextType => {
  return useContext(ConversationSocketContext);
};

interface ConversationSocketProviderProps {
  session: SessionType | null;
  children: ReactNode;
}

export const ConversationSocketProvider: React.FC<
  ConversationSocketProviderProps
> = ({ session, children }) => {
  const [conversationSocket, setConversationSocket] =
    useState<WebSocket | null>(null);

  useEffect(() => {
    if (session?.token) {
      const ws = new WebSocket(
        `ws://${pkg.backend_host}/ws/conversation/${session?.user?.id}/?token=${session.token}`
      );

      ws.onopen = () => {
        console.log("✅ Conversation WebSocket connected");
        setConversationSocket(ws);
      };

      ws.onclose = () => {
        console.log("❌ Conversation WebSocket disconnected");
        setConversationSocket(null);
      };

      ws.onerror = (error) => {
        console.error("Conversation WebSocket error:", error);
      };

      return () => {
        ws.close();
        setConversationSocket(null);
      };
    } else {
      setConversationSocket(null);
    }
  }, [session]);

  return (
    <ConversationSocketContext.Provider value={conversationSocket}>
      {children}
    </ConversationSocketContext.Provider>
  );
};
