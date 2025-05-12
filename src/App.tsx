import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
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

  return (
    <React.Fragment>
      <Routes>
        {session ? (
          <>
            <Route path="/chat/:id" element={<ChatPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Home />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route
              path="/reset-password/:token"
              element={<ResetPasswordConfirm />}
            />
            <Route path="*" element={<Navigate to={"/login"} />} />
          </>
        )}
      </Routes>
    </React.Fragment>
  );
}
