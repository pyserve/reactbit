"use client";

import { useNavigate } from "react-router-dom";
import pkg from "../../package.json";
import MessageNotification from "./message-notifications";
import NavHeaderProfile from "./nav-header-profile";
import Notification from "./notification";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-[96%] sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%] mx-auto">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div
              className="flex-shrink-0 flex items-center px-1 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <span className="text-2xl font-bold capitalize flex items-center gap-2">
                <img
                  src="/brand.png"
                  className="h-8 w-8 dark:bg-white dark:rounded-full"
                />
                <span>{pkg.name}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MessageNotification />
            <Notification />
            <NavHeaderProfile />
          </div>
        </div>
      </div>
    </header>
  );
}
