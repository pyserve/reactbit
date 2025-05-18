import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFetchRecords } from "@/hooks/fetch-records";
import { useSessionStore } from "@/lib/sessionStore";
import { NotificationType } from "@/schemas";
import { FaFacebookMessenger } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export default function MessageNotification() {
  const session = useSessionStore((s) => s.session);
  const navigate = useNavigate();
  const { data: notifications } = useFetchRecords({
    model: "Notification",
    query: [
      {
        key: "recipient",
        operator: "=",
        value: session?.user?.id,
      },
      {
        key: "notification_type",
        operator: "=",
        value: "message",
      },
    ],
  });

  const unreadNotifications = notifications?.filter(
    (n: NotificationType) => !n.is_read
  );

  return (
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
        {unreadNotifications?.length > 0 && (
          <span className="absolute bottom-6 left-5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            {unreadNotifications.length}
          </span>
        )}
      </div>
    </DropdownMenu>
  );
}
