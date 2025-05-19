import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSessionStore } from "@/lib/sessionStore";
import { LogOut, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserAvatar from "./user-avatar";

export default function NavHeaderProfile() {
  const session = useSessionStore((state) => state.session);
  const clearSession = useSessionStore((state) => state.clearSession);
  const navigate = useNavigate();

  const logout = () => {
    clearSession();
    navigate("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center px-0 py-0 rounded-full "
        >
          <div tabIndex={-1}>
            <UserAvatar />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem className="p-0 ">
          <div className="flex flex-col px-2">
            <div className="capitalize font-bold">
              {session?.user?.display_name || session?.user?.username}
            </div>
            <div className="text-xs">{session?.user?.email}</div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate(`/profile/${session?.user?.username}`)}
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
  );
}
