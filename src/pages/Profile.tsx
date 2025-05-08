import Header from "@/components/nav-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSession } from "@/hooks/use-session";
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
  const [activeTab, setActiveTab] = useState("posts");
  const session = getSession();

  const profileUsername = username || "current";
  const isCurrentUser = profileUsername === "current";

  const userData = session?.user;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Header />

      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 md:h-64 w-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
          <img
            src={userData.coverImage || "/placeholder.svg"}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Header */}
        <div className="container max-w-6xl mx-auto px-4">
          <div className="relative -mt-16 sm:-mt-20 mb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-end">
              {/* Avatar */}
              <Avatar className="h-32 w-32 border-4 border-white dark:border-black rounded-full">
                <AvatarImage
                  src={userData.avatar || "/placeholder.svg"}
                  alt={userData.name}
                />
                <AvatarFallback className="text-4xl">
                  {userData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              {/* User Info */}
              <div className="mt-4 sm:mt-0 sm:ml-4 mb-2">
                <h1 className="text-2xl font-bold">{userData.name}</h1>
                <p className="text-gray-500 dark:text-gray-400">
                  @{userData.username}
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
              <p className="text-sm md:text-base">{userData.bio}</p>

              <div className="flex flex-wrap gap-y-2 gap-x-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                {userData.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{userData.location}</span>
                  </div>
                )}
                {userData.website && (
                  <div className="flex items-center">
                    <LinkIcon className="h-4 w-4 mr-1" />
                    <a
                      href={`https://${userData.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {userData.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-1" />
                  <span>Joined {userData.joinDate}</span>
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <div>
                  <span className="font-semibold">{userData.following}</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">
                    Following
                  </span>
                </div>
                <div>
                  <span className="font-semibold">{userData.followers}</span>
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
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:shadow-none py-2 px-4"
              >
                Posts
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:shadow-none py-2 px-4"
              >
                Projects
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:shadow-none py-2 px-4"
              >
                About
              </TabsTrigger>
            </TabsList>

            {/* Posts Tab */}
            <TabsContent value="posts" className="mt-6 space-y-6">
              {userData.posts.length > 0 ? (
                userData.posts.map((post) => (
                  <Card
                    key={post.id}
                    className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black"
                  >
                    <CardContent className="pt-6">
                      <p>{post.content}</p>
                      <div className="flex justify-between items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>{post.date}</span>
                        <div className="flex space-x-4">
                          <span>{post.likes} likes</span>
                          <span>{post.comments} comments</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <p>No posts yet</p>
                </div>
              )}
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="mt-6 space-y-6">
              {userData.projects.length > 0 ? (
                userData.projects.map((project) => (
                  <Card
                    key={project.id}
                    className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black"
                  >
                    <CardHeader>
                      <CardTitle>{project.name}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                      >
                        <LinkIcon className="h-4 w-4 mr-1" />
                        View Project
                      </a>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <p>No projects yet</p>
                  {isCurrentUser && (
                    <Button
                      variant="outline"
                      className="mt-4 border-gray-200 dark:border-gray-800"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Add Project
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>

            {/* About Tab */}
            <TabsContent value="about" className="mt-6">
              <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
                <CardHeader>
                  <CardTitle>About {userData.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Bio</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {userData.bio}
                    </p>
                  </div>
                  <Separator className="my-4" />
                  <div>
                    <h3 className="font-medium mb-2">Location</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {userData.location}
                    </p>
                  </div>
                  <Separator className="my-4" />
                  <div>
                    <h3 className="font-medium mb-2">Website</h3>
                    <a
                      href={`https://${userData.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {userData.website}
                    </a>
                  </div>
                  <Separator className="my-4" />
                  <div>
                    <h3 className="font-medium mb-2">Joined</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {userData.joinDate}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
