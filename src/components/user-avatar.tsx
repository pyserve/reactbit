import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSessionStore } from "@/lib/sessionStore";
import { UserType } from "@/schemas";

export default function UserAvatar({
  user,
  size = 40,
}: {
  user?: UserType;
  size?: number;
}) {
  const getSession = useSessionStore((state) => state.session);

  const session = user ? { user } : getSession;

  return (
    <Avatar
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.5,
        color: "white",
        fontWeight: "bold",
      }}
    >
      <AvatarImage
        src={session?.user?.image || "/placeholder.svg?height=40&width=40"}
        alt={session?.user?.username || "User"}
      />
      <AvatarFallback className="capitalize">
        {session?.user?.username?.[0] || "U"}
      </AvatarFallback>
    </Avatar>
  );
}
