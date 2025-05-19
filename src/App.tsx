import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { SocketProvider } from "./contexts/socket-context";
import { useSessionStore } from "./lib/sessionStore";
import ChatPage from "./pages/Chat";
import ForgotPasswordPage from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProfilePage from "./pages/Profile";
import SignUp from "./pages/Register";
import ResetPasswordConfirm from "./pages/ResetPasswordConfirm";
import SettingsPage from "./pages/Settings";

export default function App() {
  const initializeSession = useSessionStore((state) => state.initializeSession);
  const session = useSessionStore((state) => state.session);

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  if (!session) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/reset-password/:token"
          element={<ResetPasswordConfirm />}
        />
      </Routes>
    );
  }

  return (
    <SocketProvider session={session}>
      <Routes>
        <Route path="/chat/:id" element={<ChatPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </SocketProvider>
  );
}
