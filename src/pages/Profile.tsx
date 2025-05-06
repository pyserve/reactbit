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

// Mock user data
const mockUsers = {
  alexj: {
    id: 1,
    username: "alexj",
    name: "Alex Johnson",
    bio: "Software engineer passionate about UI/UX design and web technologies. Building tools that make people's lives easier.",
    avatar: "/placeholder.svg?height=150&width=150",
    coverImage: "/placeholder.svg?height=300&width=1200",
    location: "San Francisco, CA",
    website: "alexjohnson.dev",
    joinDate: "January 2020",
    following: 245,
    followers: 1024,
    posts: [
      {
        id: 1,
        content:
          "Just launched my new portfolio website! Check it out and let me know what you think.",
        date: "2 days ago",
        likes: 24,
        comments: 8,
      },
      {
        id: 2,
        content:
          "Working on a new open-source project that helps developers build accessible UIs faster. Stay tuned for updates!",
        date: "1 week ago",
        likes: 56,
        comments: 12,
      },
      {
        id: 3,
        content:
          "Attended an amazing conference on web performance yesterday. So many great insights to implement!",
        date: "2 weeks ago",
        likes: 42,
        comments: 5,
      },
    ],
    projects: [
      {
        id: 1,
        name: "Portfolio Website",
        description: "Personal portfolio showcasing my work and skills",
        technologies: ["React", "Tailwind CSS", "Framer Motion"],
        link: "https://alexjohnson.dev",
      },
      {
        id: 2,
        name: "AccessUI",
        description:
          "Open-source library for building accessible UI components",
        technologies: ["TypeScript", "React", "ARIA"],
        link: "https://github.com/alexj/accessui",
      },
    ],
  },
  samr: {
    id: 2,
    username: "samr",
    name: "Sam Rivera",
    bio: "Product designer and illustrator. Creating digital experiences that delight users.",
    avatar: "/placeholder.svg?height=150&width=150",
    coverImage: "/placeholder.svg?height=300&width=1200",
    location: "Portland, OR",
    website: "samrivera.design",
    joinDate: "March 2019",
    following: 312,
    followers: 1456,
    posts: [
      {
        id: 1,
        content: "Just published my new design system case study. Link in bio!",
        date: "3 days ago",
        likes: 78,
        comments: 14,
      },
      {
        id: 2,
        content:
          "Design tip: Always test your color palette for accessibility. Here's a tool I use daily.",
        date: "1 week ago",
        likes: 92,
        comments: 23,
      },
    ],
    projects: [
      {
        id: 1,
        name: "Harmony Design System",
        description: "A comprehensive design system for web and mobile",
        technologies: ["Figma", "Storybook", "React"],
        link: "https://harmony.design",
      },
    ],
  },
  current: {
    id: 0,
    username: "current",
    name: "Your Name",
    bio: "This is your profile. Add a bio to tell the world about yourself.",
    avatar: "/placeholder.svg?height=150&width=150",
    coverImage: "/placeholder.svg?height=300&width=1200",
    location: "Your Location",
    website: "yourwebsite.com",
    joinDate: "April 2023",
    following: 42,
    followers: 38,
    posts: [
      {
        id: 1,
        content: "Just set up my new profile!",
        date: "Just now",
        likes: 0,
        comments: 0,
      },
    ],
    projects: [],
  },
};

export default function ProfilePage() {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState("posts");

  // If no username is provided or if "me" is provided, show current user
  const profileUsername = username || "current";
  const isCurrentUser = profileUsername === "current";

  // Get user data
  const userData = mockUsers[profileUsername] || mockUsers.current;

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
