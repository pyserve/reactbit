import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSession } from "@/hooks/use-session";

export default function UserAvatar() {
  const session = getSession();

  return (
    <Avatar>
      <AvatarImage
        src={session?.user?.image || "/placeholder.svg?height=40&width=40"}
        alt={session?.user?.name || "User"}
      />
      <AvatarFallback>{session?.user?.name?.[0] || "U"}</AvatarFallback>
    </Avatar>
  );
}
