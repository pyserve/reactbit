import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { backend_host, protocol } from ".";

type SocketContextType = WebSocket | null;
const SocketContext = createContext<SocketContextType>(null);

export const useSocket = (): SocketContextType => {
  return useContext(SocketContext);
};

interface SocketProviderProps {
  session: { token: string } | null;
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({
  session,
  children,
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (session?.token) {
      const ws = new WebSocket(
        `${protocol}://${backend_host}/ws/notifications/?token=${session.token}`
      );

      ws.onopen = () => {
        console.log("✅ WebSocket connected");
        setSocket(ws);
      };

      ws.onclose = () => {
        console.log("❌ WebSocket disconnected");
        setSocket(null);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      // Cleanup on unmount or session change
      return () => {
        ws.close();
        setSocket(null);
      };
    } else {
      setSocket(null);
    }
  }, [session]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
