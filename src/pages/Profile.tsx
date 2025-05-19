import AboutSection from "@/components/about-section";
import CoverPhoto from "@/components/cover-image";
import { EditProfileForm } from "@/components/edit-profile-form";
import Header from "@/components/nav-header";
import PostList from "@/components/post-list";
import PostsSidebar from "@/components/post-sidebar";
import ProfileImage from "@/components/profile-image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserCard from "@/components/user-card";
import { useSocket } from "@/contexts/socket-context";
import { useConnectUser } from "@/hooks/connect-user";
import { useFetchRecords } from "@/hooks/fetch-records";
import { useSessionStore } from "@/lib/sessionStore";
import { formatDateTime } from "@/lib/utils";
import { UserType } from "@/schemas";
import { useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  Check,
  Copy,
  Edit,
  LinkIcon,
  MapPin,
  MessageSquare,
  Share2,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

export default function ProfilePage() {
  const { username } = useParams();
  // const [activeTab, setActiveTab] = useState<any>();
  const session = useSessionStore((state) => state.session);
  const setSession = useSessionStore((state) => state.setSession);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const connectUser = useConnectUser();
  const queryClient = useQueryClient();
  const notificationSocket = useSocket();
  const [textColor, setTextColor] = useState([255, 255, 255]);
  const textColorString = `rgb(${255 - textColor[0]}, ${255 - textColor[1]}, ${
    255 - textColor[2]
  })`;

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
    enabled: !!user?.id,
  });

  const profileUrl = window.location.origin + `/profile/${username}`;
  const isCurrentUser = session?.user.username === username;
  const isFollowing = session?.user?.following?.some((uid) => uid === user?.id);

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    toast.success("Share link to the profile is copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const followUser = async (actionType: string, user: UserType) => {
    if (!session) {
      toast.error("Session not defined");
      return;
    }

    try {
      const updatedUser = await connectUser.mutateAsync({
        current: session?.user,
        other: user,
        actionType,
      });
      console.log("🚀 ~ followUser ~ updatedUser:", updatedUser);
      setSession(session.token, updatedUser);
      if (actionType === "follow" && user.id !== session?.user?.id) {
        notificationSocket?.send(
          JSON.stringify({
            recipient: user.id,
            sender: session?.user?.id,
            model: "user",
            record_id: user.id,
            notification_type: "follow",
            message: `${session?.user?.username} started following you`,
          })
        );
      }
      toast.success(`You have successfully ${actionType}ed ${user.username}!`);
      queryClient.invalidateQueries({
        queryKey: [
          "User",
          [{ key: "username", operator: "=", value: username }],
        ],
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error");
    }
  };

  return (
    <div className="py-6 min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Header />

      <div className="relative">
        <div className="h-48 md:h-64 w-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
          <CoverPhoto user={user} setTextColor={setTextColor} />
        </div>

        <div className="container md:max-w-6xl mx-auto px-4">
          <div className="relative -mt-16 sm:-mt-20 mb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between">
            <ProfileImage user={user} textColor={textColorString} />

            {/* Action Buttons */}
            <div className="mt-4 sm:mt-0 flex space-x-2">
              {isCurrentUser ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-gray-200 dark:border-gray-800"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <EditProfileForm user={user} />
                </Dialog>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="border-gray-200 dark:border-gray-800"
                    onClick={() => navigate(`/chat/${user?.id}`)}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Message
                  </Button>
                  <Button
                    onClick={() =>
                      isFollowing
                        ? followUser("unfollow", user)
                        : followUser("follow", user)
                    }
                  >
                    {isFollowing ? <Check /> : <UserPlus className="h-4 w-4" />}
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                </>
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Share this profile</DialogTitle>
                    <DialogDescription>
                      Copy and share the link below.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center gap-2 py-4">
                    <Input value={profileUrl} readOnly />
                    <Button variant="outline" onClick={handleCopy}>
                      {copied ? <Check /> : <Copy className="w-4 h-4 mr-1" />}
                    </Button>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="secondary"
                      onClick={() => window.open(profileUrl, "_blank")}
                    >
                      Open Profile
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
          <Tabs defaultValue="posts" className="mt-8">
            <TabsList className="w-full border-b bg-transparent p-0">
              <TabsTrigger
                value="posts"
                className="rounded-none border-b-2 border-transparent py-2 px-4 data-[state=active]:border-b-gray-400 data-[state=active]:bg-gray-100 data-[state=active]:font-bold"
              >
                Posts ({posts?.length})
              </TabsTrigger>
              <TabsTrigger
                value="followers"
                className="rounded-none border-b-2 border-transparent py-2 px-4 data-[state=active]:border-b-gray-400 data-[state=active]:bg-gray-100 data-[state=active]:font-bold"
              >
                Followers ({user?.followers?.length})
              </TabsTrigger>
              <TabsTrigger
                value="following"
                className="rounded-none border-b-2 border-transparent py-2 px-4 data-[state=active]:border-b-gray-400 data-[state=active]:bg-gray-100 data-[state=active]:font-bold"
              >
                Following ({user?.following?.length})
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="rounded-none border-b-2 border-transparent py-2 px-4 data-[state=active]:border-b-gray-400 data-[state=active]:bg-gray-100 data-[state=active]:font-bold"
              >
                About
              </TabsTrigger>
            </TabsList>

            {/* Posts Tab */}
            <TabsContent
              value="posts"
              className="mt-6 space-y-6 grid grid-cols-5 gap-4"
            >
              <div className="col-span-12 md:col-span-2 ">
                <PostsSidebar posts={posts} user={user} />
              </div>
              <div className="col-span-12 md:col-span-3">
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
            <TabsContent value="followers" className="mt-6 space-y-6 ">
              {user ? (
                <UserCard
                  users={[...(user?.followers ?? [])]}
                  listType="followers"
                  followUser={followUser}
                />
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
                <UserCard
                  users={[...(user?.following ?? [])]}
                  listType="following"
                  followUser={followUser}
                />
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
