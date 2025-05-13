import { useFetchRecords } from "@/hooks/fetch-records";
import { useSessionStore } from "@/lib/sessionStore";
import { UserType } from "@/schemas";
import { MessageCircle } from "lucide-react";
import PieAvatar from "./pie-avatar";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function UserCard({ users }: { users: number[] }) {
  const session = useSessionStore((state) => state.session);
  const { data: fetchedUsers } = useFetchRecords({
    model: "User",
    query: [{ key: "id__in", operator: "=", value: users.join(", ") }],
  });

  if (!session) return;

  return (
    <div className="grid grid-cols-3 items-center gap-4">
      {fetchedUsers
        ?.filter((u: UserType) => u.id !== session?.user?.id)
        ?.map((user: UserType) => {
          return (
            <Card
              key={user.id}
              className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black"
            >
              <CardHeader>
                <div className="flex items-center">
                  <div className="me-2">
                    <PieAvatar participants={[user, session.user]} />
                  </div>
                  <div>
                    <CardTitle>{user.display_name}</CardTitle>
                    <CardDescription>
                      @ {user.username || user.email}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-1">
                  <a href="/chat" className="w-full">
                    <Button
                      variant={"secondary"}
                      className="w-full border border-gray-300"
                    >
                      <MessageCircle />
                      <span>Start Chat</span>
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
}
