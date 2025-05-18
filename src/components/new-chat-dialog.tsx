import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateRecord } from "@/hooks/create-record";
import { useFetchRecords } from "@/hooks/fetch-records";
import { useSessionStore } from "@/lib/sessionStore";
import { UserType } from "@/schemas";
import { ReactElement, useState } from "react";
import toast from "react-hot-toast";
import { FaFacebookMessenger } from "react-icons/fa";
import PieAvatar from "./pie-avatar";
import { UserListSkeleton } from "./skeletons/user-list-skeletion";
import { Button } from "./ui/button";

export default function NewChatDialog({ trigger }: { trigger?: ReactElement }) {
  const session = useSessionStore((state) => state.session);
  const [dialogOpen, setDialogOpen] = useState(false);
  const createRecord = useCreateRecord();

  const followers = session?.user?.followers ?? [];
  const following = session?.user?.following ?? [];
  const { data: users } = useFetchRecords({
    model: "User",
    query: [
      {
        key: "id__in",
        operator: "=",
        value: [...followers, ...following].join(","),
      },
    ],
  });

  const fetchOrCreateConversation = async (participants: UserType[]) => {
    try {
      const data = await createRecord.mutateAsync({
        url: "/conversations/",
        data: { participants: participants?.map((u) => u?.id) },
      });
      console.log("🚀 ~ fetchOrCreateConversation ~ data:", data);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleStartChat = (participants: UserType[]) => {
    fetchOrCreateConversation(participants);
    setDialogOpen(false);
  };

  if (!session) return <UserListSkeleton />;

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
          {users
            ?.filter((id: number) => id !== session?.user.id)
            ?.map((user: UserType) => (
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
                  <FaFacebookMessenger />
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
