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
import { fetchOrCreateConversationType, UserType } from "@/schemas";
import { MessageCircleHeart } from "lucide-react";
import { ReactElement, useState } from "react";
import PieAvatar from "./pie-avatar";
import { Button } from "./ui/button";

export default function NewChatDialog({
  createNewConversation,
  trigger,
}: {
  createNewConversation: fetchOrCreateConversationType;
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
    createNewConversation(participants);
    setDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          size={"sm"}
          variant={"outline"}
          className="border-gray-300"
          onClick={() => setDialogOpen(true)}
        >
          {trigger ? trigger : "Start New Chat"}
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
              <div className="flex items-center">
                <div className="mr-2">
                  <PieAvatar participants={[user, session.user]} />
                </div>
                <div>
                  <div className="font-semibold">{user?.username}</div>
                  <div className="text-sm text-muted-foreground">
                    {user?.email}
                  </div>
                </div>
              </div>
              <Button
                type="button"
                className="bg-blue-500 text-white"
                variant="outline"
                onClick={() => handleStartChat([user, session.user])}
              >
                <MessageCircleHeart />
                Message
              </Button>
            </div>
          ))}
        </div>
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}
