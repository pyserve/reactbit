import EmptyState from "@/components/empty-state";
import FriendCard from "@/components/friend-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaQuery } from "@/hooks/use-media-query";
import { getSession } from "@/hooks/use-session";
import { UserType } from "@/schemas";
import { RefreshCw, Users } from "lucide-react";
import { useState } from "react";

export default function ConnectionCard({
  followers,
  following,
  suggestions,
  IsLoading,
}: {
  followers: UserType[];
  following: UserType[];
  suggestions: UserType[];
  IsLoading: boolean;
}) {
  const [search, setSearch] = useState("");
  const session = getSession();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="lg:col-span-5 xl:col-span-4 space-y-6">
      <Tabs defaultValue="following" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-900">
          <TabsTrigger
            value="following"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-black"
          >
            <Users className="mr-2 h-4 w-4" />
            Following ({followers.length})
          </TabsTrigger>
          <TabsTrigger
            value="followers"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-black"
          >
            <Users className="mr-2 h-4 w-4" />
            Followers ({following.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="following" className="mt-4">
          <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
            <CardHeader>
              <CardTitle>People You Follow</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Friends and connections you're currently following
              </CardDescription>
            </CardHeader>
            <CardContent>
              {IsLoading ? (
                <div className="flex justify-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : following.length > 0 ? (
                <div className="space-y-4">
                  {following.map((user: UserType) => (
                    <FriendCard
                      key={user.id}
                      user={user}
                      actionType="unfollow"
                      onAction={() => null}
                      isMobile={isMobile}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title={
                    search
                      ? "No matching connections"
                      : "You're not following anyone yet"
                  }
                  description={
                    search
                      ? "Try a different search term"
                      : "When you follow people, they'll appear here."
                  }
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="followers" className="mt-4">
          <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
            <CardHeader>
              <CardTitle>Your Followers</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                People who are following you
              </CardDescription>
            </CardHeader>
            <CardContent>
              {IsLoading ? (
                <div className="flex justify-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : followers.length > 0 ? (
                <div className="space-y-4">
                  {followers.map((user: UserType) => (
                    <FriendCard
                      key={user.id}
                      user={user}
                      actionType={
                        session?.user?.following?.some(
                          (f: UserType) => f.id === user.id
                        )
                          ? "following"
                          : "follow"
                      }
                      onAction={() => null}
                      isMobile={isMobile}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title={search ? "No matching followers" : "No followers yet"}
                  description={
                    search
                      ? "Try a different search term"
                      : "When people follow you, they'll appear here."
                  }
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
        <CardHeader>
          <CardTitle>Suggested Friends</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            People you might want to connect with
          </CardDescription>
        </CardHeader>
        <CardContent>
          {IsLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : suggestions.length > 0 ? (
            <div className="space-y-4">
              {suggestions.map((user: UserType) => (
                <FriendCard
                  key={user.id}
                  user={user}
                  actionType="follow"
                  onAction={() => null}
                  isMobile={isMobile}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title={
                search ? "No matching suggestions" : "No suggestions right now"
              }
              description={
                search
                  ? "Try a different search term"
                  : "Check back later for friend suggestions."
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
