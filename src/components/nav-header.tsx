"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSessionStore } from "@/lib/sessionStore";
import { BellIcon, LogOut, Settings, User } from "lucide-react";
import { useState } from "react";
import { FaFacebookMessenger } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import pkg from "../../package.json";
import Notification from "./notification";
import UserAvatar from "./user-avatar";

export default function Header() {
  const session = useSessionStore((state) => state.session);
  const clearSession = useSessionStore((state) => state.clearSession);
  const [openNotification, setOpenNotification] = useState(false);

  const navigate = useNavigate();

  const logout = () => {
    clearSession();
    navigate("/");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div
              className="flex-shrink-0 flex items-center px-1 cursor-default"
              onClick={() => navigate("/")}
            >
              <span className="text-2xl font-bold capitalize">{pkg.name}</span>
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center gap-2">
            <DropdownMenu>
              <div className="relative">
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center px-0 py-0 rounded-full bg-gray-100"
                    onClick={() => navigate("/chat/")}
                  >
                    <FaFacebookMessenger />
                  </Button>
                </DropdownMenuTrigger>
                <span className="absolute bottom-6 left-5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  {10}
                </span>
              </div>
            </DropdownMenu>
            <DropdownMenu
              open={openNotification}
              onOpenChange={setOpenNotification}
            >
              <div className="relative">
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center px-0 py-0 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-0"
                  >
                    <BellIcon className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <Notification openNotification={openNotification} />
              </div>
            </DropdownMenu>

            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center px-0 py-0 rounded-full"
                  >
                    <div tabIndex={-1}>
                      <UserAvatar />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {!session?.expiry && (
                    <div className="px-2 py-1.5 text-xs text-red-500">
                      Session expired
                    </div>
                  )}
                  <DropdownMenuItem className="border-b">
                    <div className="flex flex-col">
                      <div className="capitalize font-bold">
                        {session?.user?.display_name || session?.user?.username}
                      </div>
                      <div className="text-xs">{session?.user?.email}</div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      navigate(`/profile/${session?.user?.username}`)
                    }
                    className="cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/settings")}
                    className="cursor-pointer"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="cursor-pointer text-red-500 focus:text-red-500"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </Button>
                <Button size="sm">Sign Up</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
