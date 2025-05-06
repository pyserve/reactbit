import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { getSession } from "./hooks/use-session";
import ChatPage from "./pages/Chat";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProfilePage from "./pages/Profile";
import SettingsPage from "./pages/Settings";

export default function App() {
  const session = getSession();
  console.log("🚀 ~ App ~ session:", session);

  // if (!session) return <Navigate to={"/login"} />;

  return (
    <React.Fragment>
      <Routes>
        {session ? (
          <>
            <Route path="/chat/:id" element={<ChatPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Home />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to={"/login"} />} />
          </>
        )}
      </Routes>
    </React.Fragment>
  );
}
