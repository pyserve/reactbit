import { useFetchRecords } from "@/hooks/fetch-records";
import { useSessionStore } from "@/lib/sessionStore";
import { formatDateTime } from "@/lib/utils";
import { UserType } from "@/schemas";
import { UserMinus2, UserPlus2 } from "lucide-react";
import { FaFacebookMessenger } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import PieAvatar from "./pie-avatar";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function UserCard({
  users,
  listType,
  followUser,
}: {
  users: number[];
  listType?: string;
  followUser?: any;
}) {
  const session = useSessionStore((state) => state.session);
  const { username } = useParams();

  const { data: fetchedUsers } = useFetchRecords({
    model: "User",
    query: [{ key: "id__in", operator: "=", value: users.join(", ") }],
  });

  const isFollowing = (userId: number) => {
    return session?.user?.following?.some((uid) => uid === userId);
  };

  const isFollower = (userId: number) => {
    return session?.user?.followers?.some((uid) => uid === userId);
  };

  if (!session) return;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {fetchedUsers
        ?.filter((u: UserType) => u?.username !== username)
        ?.map((user: UserType) => (
          <Card
            key={user.id}
            className="gap-3 h-full flex flex-col justify-between border-gray-200 dark:border-gray-800 bg-white dark:bg-black"
          >
            <CardHeader className="flex-grow">
              <div className="flex items-start gap-3">
                <PieAvatar
                  participants={[user]}
                  size={45}
                  username={username}
                />
                <div className="space-y-1">
                  <CardTitle className="text-base">
                    <Link
                      className="hover:underline"
                      to={`/profile/${user.username}`}
                    >
                      {user.display_name}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground truncate">
                    <Link
                      className="hover:underline"
                      to={`/profile/${user.username}`}
                    >
                      <span> @{user.username || user.email}</span>
                    </Link>
                    <span className="font-bold mx-1">·</span>
                    <span>
                      Joined on {formatDateTime(user.date_joined, "date")}
                    </span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col justify-between flex-grow">
              <div className="flex items-center justify-between gap-2 mt-2">
                <div className="flex-1">
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={() => {
                      const isUserFollowing =
                        listType === "followers"
                          ? isFollowing(user.id)
                          : isFollower(user.id);

                      if (isUserFollowing) {
                        followUser("unfollow", user);
                      } else {
                        followUser("follow", user);
                      }
                    }}
                  >
                    <span className="flex gap-2 items-center">
                      {listType === "followers" ? (
                        isFollowing(user.id) ? (
                          <>
                            <UserMinus2 /> Unfollow
                          </>
                        ) : (
                          <>
                            <UserPlus2 /> Follow
                          </>
                        )
                      ) : isFollower(user.id) ? (
                        <>
                          <UserMinus2 /> Unfollow
                        </>
                      ) : (
                        <>
                          <UserPlus2 /> Follow
                        </>
                      )}
                    </span>
                  </Button>
                </div>
                <div className="flex-1">
                  <Link to={`/chat/${user.id}`} className="block w-full">
                    <Button variant="secondary" className="w-full border">
                      <FaFacebookMessenger className="mr-2" />
                      <span>Message</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
