import AboutSection from "@/components/about-section";
import Header from "@/components/nav-header";
import PostList from "@/components/post-list";
import PostsSidebar from "@/components/post-sidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserAvatar from "@/components/user-avatar";
import UserCard from "@/components/user-card";
import { useFetchRecords } from "@/hooks/fetch-records";
import { useSessionStore } from "@/lib/sessionStore";
import { formatDateTime } from "@/lib/utils";
import {
  CalendarDays,
  Edit,
  LinkIcon,
  MapPin,
  MessageSquare,
  Share2,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function ProfilePage() {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState();
  console.log("🚀 ~ ProfilePage ~ username:", username);
  const session = useSessionStore((state) => state.session);
  const { data: users } = useFetchRecords({
    model: "User",
    query: [{ key: "username", operator: "=", value: username }],
  });
  const user = users?.[0];

  const { data: posts } = useFetchRecords({
    model: "Post",
    query: [
      {
        key: "user",
        value: user?.id,
        operator: "=",
      },
    ],
  });

  const isCurrentUser = session?.user.username === username;

  return (
    <div className="py-6 min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Header />

      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 md:h-64 w-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
          <img
            src={user?.cover || "/placeholder.svg"}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Header */}
        <div className="container max-w-6xl mx-auto px-4">
          <div className="relative -mt-16 sm:-mt-20 mb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-end">
              <UserAvatar user={user} />

              {/* User Info */}
              <div className="mt-4 sm:mt-0 sm:ml-4 mb-2">
                <h1 className="text-2xl font-bold">{user?.username}</h1>
                <p className="text-gray-500 dark:text-gray-400">
                  @{user?.username}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 sm:mt-0 flex space-x-2">
              {isCurrentUser ? (
                <Button
                  variant="outline"
                  className="border-gray-200 dark:border-gray-800"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="border-gray-200 dark:border-gray-800"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Follow
                  </Button>
                </>
              )}
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Bio and Details */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            <div className="md:col-span-3">
              <p className="text-sm md:text-base">{user?.bio}</p>

              <div className="flex flex-wrap gap-y-2 gap-x-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                {user?.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{user?.location}</span>
                  </div>
                )}
                {user?.website && (
                  <div className="flex items-center">
                    <LinkIcon className="h-4 w-4 mr-1" />
                    <a
                      href={`https://${user?.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {user?.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-1" />
                  <span>
                    Joined {formatDateTime(user?.date_joined, "date")}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <div>
                  <span className="font-semibold">
                    {user?.following?.length}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">
                    Following
                  </span>
                </div>
                <div>
                  <span className="font-semibold">
                    {user?.followers?.length}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">
                    Followers
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            defaultValue="posts"
            className="mt-8"
            onValueChange={setActiveTab}
          >
            <TabsList className="w-full border-b border-gray-200 dark:border-gray-800 bg-transparent p-0">
              <TabsTrigger
                value="posts"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-700 dark:data-[state=active]:border-white data-[state=active]:shadow-none py-2 px-4"
              >
                Posts ({posts?.length})
              </TabsTrigger>
              <TabsTrigger
                value="followers"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-700 dark:data-[state=active]:border-white data-[state=active]:shadow-none py-2 px-4"
              >
                Followers ({user?.followers?.length})
              </TabsTrigger>
              <TabsTrigger
                value="following"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-700 dark:data-[state=active]:border-white data-[state=active]:shadow-none py-2 px-4"
              >
                Following ({user?.following?.length})
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-700 dark:data-[state=active]:border-white data-[state=active]:shadow-none py-2 px-4"
              >
                About
              </TabsTrigger>
            </TabsList>

            {/* Posts Tab */}
            <TabsContent
              value="posts"
              className="mt-6 space-y-6 grid grid-cols-5 gap-4"
            >
              <div className="col-span-2">
                <PostsSidebar posts={posts} />
              </div>
              <div className="col-span-3">
                {posts?.length > 0 ? (
                  <div className="space-y-6">
                    <PostList posts={posts} />
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <p>No posts yet</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Followers Tab */}
            <TabsContent value="followers" className="mt-6 space-y-6">
              {user ? (
                <UserCard users={[...(user?.followers ?? [])]} />
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <p>No following yet</p>
                  {isCurrentUser && (
                    <Button
                      variant="outline"
                      className="mt-4 border-gray-200 dark:border-gray-800"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Add Friends
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>

            {/* Following Tab */}
            <TabsContent value="following" className="mt-6 space-y-6">
              {user ? (
                <UserCard users={[...(user?.following ?? [])]} />
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <p>No following yet</p>
                  {isCurrentUser && (
                    <Button
                      variant="outline"
                      className="mt-4 border-gray-200 dark:border-gray-800"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Add Friends
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>

            <AboutSection user={user} />
          </Tabs>
        </div>
      </div>
    </div>
  );
}
