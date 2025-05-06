"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getSession } from "@/hooks/use-session";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { useNavigation } from "react-router-dom";
import pkg from "../../package.json";

export default function Header() {
  const session = getSession();
  const navigate = useNavigation();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              {/* Replace with your logo */}
              <span className="text-xl font-bold capitalize">{pkg.name}</span>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a
                href="/"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Chat
              </a>
              <a
                href="/dashboard"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Video
              </a>
            </nav>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session.user?.image || "/placeholder.svg"}
                        alt={session.user?.username || "User"}
                      />
                      <AvatarFallback className="bg-amber-100 capitalize">
                        {session.user?.username?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {!session?.expiry && (
                    <div className="px-2 py-1.5 text-xs text-red-500">
                      Session expired
                    </div>
                  )}
                  <DropdownMenuItem
                    onClick={handleProfileClick}
                    className="cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleSettingsClick}
                    className="cursor-pointer"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => null}
                    className="cursor-pointer text-red-500 focus:text-red-500"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-4">
                <Button variant="outline" size="sm">
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
