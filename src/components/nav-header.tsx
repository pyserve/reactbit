"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getSession, useSession } from "@/hooks/use-session";
import { BellIcon, LogOut, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import pkg from "../../package.json";
import UserAvatar from "./user-avatar";

export default function Header() {
  const session = getSession();
  const { clearSession } = useSession();
  const navigate = useNavigate();

  const logout = () => {
    clearSession();
    window.location.reload();
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

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center px-1 py-0 rounded-full"
                >
                  <BellIcon />
                </Button>
              </DropdownMenuTrigger>
            </DropdownMenu>

            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center px-1 py-0 rounded-full"
                  >
                    <UserAvatar />
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
                        {session?.user?.username}
                      </div>
                      <div className="text-xs">{session?.user?.email}</div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/profile")}
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
