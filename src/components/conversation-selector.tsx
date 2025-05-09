import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserType } from "@/schemas";
import NewChatDialog from "./new-chat-dialog";

const ConversationSelector = ({
  createNewConversation,
}: {
  createNewConversation: (participants: UserType[]) => void;
}) => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <Card className="w-[80%] max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Select a conversation</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-gray-500">
          Choose a contact from the list to start chatting
          <div className="mt-4">
            <NewChatDialog createNewConversation={createNewConversation} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversationSelector;
