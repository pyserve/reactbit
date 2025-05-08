import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getSession } from "@/hooks/use-session";
import { UserType } from "@/schemas";
import { ReactElement, useState } from "react";
import { Button } from "./ui/button";

export default function NewChatDialog({
  createNewConversation,
  trigger,
}: {
  createNewConversation: (participants: UserType[]) => void;
  trigger?: ReactElement;
}) {
  const session = getSession();
  const [dialogOpen, setDialogOpen] = useState(false);

  const followers = session?.user?.followers;
  const following = session?.user?.following;
  const users = Array.from(
    new Map(
      [...followers, ...following].map((user) => [user.id, user])
    ).values()
  );

  const handleStartChat = (participants: UserType[]) => {
    console.log("🚀 ~ handleStartChat ~ user:", participants);
    createNewConversation(participants);
    setDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="" onClick={() => setDialogOpen(true)}>
          {trigger ? trigger : "Start Chat"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a User</DialogTitle>
          <DialogDescription>
            Choose someone to start a conversation with
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {users.map((user) => (
            <div
              key={user?.id}
              className="flex items-center justify-between border p-2 rounded"
            >
              <div>
                <div className="font-semibold">{user?.username}</div>
                <div className="text-sm text-muted-foreground">
                  {user?.email}
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleStartChat([user, session.user])}
              >
                Start Chat
              </Button>
            </div>
          ))}
        </div>
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}
