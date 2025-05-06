"use client";

import EmptyState from "@/components/empty-state";
import FriendCard from "@/components/friend-card";
import Header from "@/components/nav-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaQuery } from "@/hooks/use-media-query";
import { getSession } from "@/hooks/use-session";
import {
  BookmarkIcon,
  MessageCircle,
  MoreHorizontal,
  RefreshCw,
  Search,
  Share2,
  ThumbsUp,
  Users,
} from "lucide-react";
import { useState } from "react";

// Mock data - replace with your actual data fetching logic
const mockData = {
  following: [
    {
      id: 1,
      name: "Alex Johnson",
      username: "alexj",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Sam Rivera",
      username: "samr",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Taylor Kim",
      username: "taylork",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ],
  followers: [
    {
      id: 2,
      name: "Sam Rivera",
      username: "samr",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "Jordan Lee",
      username: "jlee",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ],
  suggestions: [
    {
      id: 5,
      name: "Casey Morgan",
      username: "caseym",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 6,
      name: "Riley Patel",
      username: "rileyp",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 7,
      name: "Quinn Chen",
      username: "quinnc",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ],
  posts: [
    {
      id: 1,
      author: {
        id: 0,
        name: "Your Name",
        username: "current",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content:
        "Just launched my new portfolio website! Check it out and let me know what you think.",
      image: "/placeholder.svg?height=400&width=600",
      timestamp: "2 hours ago",
      likes: 24,
      comments: 8,
      isLiked: true,
      isBookmarked: false,
    },
    {
      id: 2,
      author: {
        id: 1,
        name: "Alex Johnson",
        username: "alexj",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content:
        "Working on a new open-source project that helps developers build accessible UIs faster. Stay tuned for updates!",
      image: null,
      timestamp: "5 hours ago",
      likes: 56,
      comments: 12,
      isLiked: false,
      isBookmarked: true,
    },
    {
      id: 3,
      author: {
        id: 2,
        name: "Sam Rivera",
        username: "samr",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "Just published my new design system case study. Link in bio!",
      image: "/placeholder.svg?height=400&width=600",
      timestamp: "1 day ago",
      likes: 78,
      comments: 14,
      isLiked: false,
      isBookmarked: false,
    },
    {
      id: 4,
      author: {
        id: 3,
        name: "Taylor Kim",
        username: "taylork",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content:
        "Attended an amazing conference on web performance yesterday. So many great insights to implement!",
      image: "/placeholder.svg?height=400&width=600",
      timestamp: "2 days ago",
      likes: 42,
      comments: 5,
      isLiked: true,
      isBookmarked: false,
    },
  ],
  ads: [
    {
      id: 1,
      title: "Boost Your Productivity",
      company: "ProductivityPro",
      description:
        "Try our new AI-powered productivity suite. First month free!",
      image: "/placeholder.svg?height=200&width=400",
      cta: "Try Free",
      link: "#",
    },
    {
      id: 2,
      title: "Learn New Skills",
      company: "SkillShare",
      description:
        "Thousands of courses from industry experts. Start learning today!",
      image: "/placeholder.svg?height=200&width=400",
      cta: "Start Learning",
      link: "#",
    },
  ],
};

export default function Home() {
  const [following, setFollowing] = useState(mockData.following);
  const [followers, setFollowers] = useState(mockData.followers);
  const [suggestions, setSuggestions] = useState(mockData.suggestions);
  const [posts, setPosts] = useState(mockData.posts);
  const [ads, setAds] = useState(mockData.ads);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const session = getSession();

  // Filter users based on search query
  const filteredFollowing = following.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFollowers = followers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSuggestions = suggestions.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Simulate data loading
  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Handle follow/unfollow actions
  const handleFollowAction = (userId: number, action: string) => {
    if (action === "follow") {
      // Find the user in suggestions
      const userToFollow = suggestions.find((user) => user.id === userId);
      if (userToFollow) {
        setFollowing([...following, userToFollow]);
        setSuggestions(suggestions.filter((user) => user.id !== userId));
      }
    } else if (action === "unfollow") {
      // Remove from following
      const userToUnfollow = following.find((user) => user.id === userId);
      if (userToUnfollow) {
        setFollowing(following.filter((user) => user.id !== userId));
        setSuggestions([...suggestions, userToUnfollow]);
      }
    }
  };

  // Handle post interactions
  const handleLikePost = (postId: number) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      })
    );
  };

  const handleBookmarkPost = (postId: number) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isBookmarked: !post.isBookmarked,
          };
        }
        return post;
      })
    );
  };

  // Insert an ad after every 3 posts
  const getContentFeed = () => {
    const feed = [];
    let adIndex = 0;

    for (let i = 0; i < posts.length; i++) {
      feed.push(
        <PostCard
          key={`post-${posts[i].id}`}
          post={posts[i]}
          onLike={handleLikePost}
          onBookmark={handleBookmarkPost}
        />
      );

      // Insert an ad after every 3 posts
      if ((i + 1) % 3 === 0 && adIndex < ads.length) {
        feed.push(<AdCard key={`ad-${ads[adIndex].id}`} ad={ads[adIndex]} />);
        adIndex++;
      }
    }

    return feed;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Header />
      <main className="container max-w-[80%] mx-auto px-4 py-6 lg:py-8">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold capitalize">
              Welcome, {session?.user?.username || "User"}
            </h1>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={isLoading}
              className="border-gray-200 dark:border-gray-800"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder="Search connections and posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-transparent border-gray-200 dark:border-gray-800"
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Feed Section - Posts and Ads */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* Create Post Card */}
            <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage
                      src={
                        session?.user?.image ||
                        "/placeholder.svg?height=40&width=40"
                      }
                      alt={session?.user?.name || "User"}
                    />
                    <AvatarFallback>
                      {session?.user?.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Input
                      placeholder="What's on your mind?"
                      className="bg-transparent border-gray-200 dark:border-gray-800"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardFooter className="pt-0 flex justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 dark:text-gray-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                    Photo
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 dark:text-gray-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    File
                  </Button>
                </div>
                <Button size="sm">Post</Button>
              </CardFooter>
            </Card>

            {/* Feed Content */}
            <div className="space-y-6">{getContentFeed()}</div>
          </div>

          {/* Sidebar - Network and Suggestions */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            <Tabs defaultValue="following" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-900">
                <TabsTrigger
                  value="following"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-black"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Following ({filteredFollowing.length})
                </TabsTrigger>
                <TabsTrigger
                  value="followers"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-black"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Followers ({filteredFollowers.length})
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
                    {isLoading ? (
                      <div className="flex justify-center py-8">
                        <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                      </div>
                    ) : filteredFollowing.length > 0 ? (
                      <div className="space-y-4">
                        {filteredFollowing.map((user) => (
                          <FriendCard
                            key={user.id}
                            user={user}
                            actionType="unfollow"
                            onAction={() =>
                              handleFollowAction(user.id, "unfollow")
                            }
                            isMobile={isMobile}
                          />
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        title={
                          searchQuery
                            ? "No matching connections"
                            : "You're not following anyone yet"
                        }
                        description={
                          searchQuery
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
                    {isLoading ? (
                      <div className="flex justify-center py-8">
                        <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                      </div>
                    ) : filteredFollowers.length > 0 ? (
                      <div className="space-y-4">
                        {filteredFollowers.map((user) => (
                          <FriendCard
                            key={user.id}
                            user={user}
                            actionType={
                              following.some((f) => f.id === user.id)
                                ? "following"
                                : "follow"
                            }
                            onAction={() =>
                              handleFollowAction(
                                user.id,
                                following.some((f) => f.id === user.id)
                                  ? "unfollow"
                                  : "follow"
                              )
                            }
                            isMobile={isMobile}
                          />
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        title={
                          searchQuery
                            ? "No matching followers"
                            : "No followers yet"
                        }
                        description={
                          searchQuery
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
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : filteredSuggestions.length > 0 ? (
                  <div className="space-y-4">
                    {filteredSuggestions.map((user) => (
                      <FriendCard
                        key={user.id}
                        user={user}
                        actionType="follow"
                        onAction={() => handleFollowAction(user.id, "follow")}
                        isMobile={isMobile}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title={
                      searchQuery
                        ? "No matching suggestions"
                        : "No suggestions right now"
                    }
                    description={
                      searchQuery
                        ? "Try a different search term"
                        : "Check back later for friend suggestions."
                    }
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

// Post Card Component
function PostCard({ post, onLike, onBookmark }) {
  return (
    <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={post.author.avatar || "/placeholder.svg"}
                alt={post.author.name}
              />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{post.author.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                @{post.author.username} · {post.timestamp}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Save post</DropdownMenuItem>
              <DropdownMenuItem>Hide post</DropdownMenuItem>
              <DropdownMenuItem>Report post</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="mb-3">{post.content}</p>
        {post.image && (
          <div className="rounded-md overflow-hidden mt-3 border border-gray-200 dark:border-gray-800">
            <img
              src={post.image || "/placeholder.svg"}
              alt="Post content"
              className="w-full h-auto object-cover"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t border-gray-100 dark:border-gray-900 pt-3 flex justify-between">
        <div className="flex gap-4">
          <Button
            variant="ghost"
            size="sm"
            className={
              post.isLiked
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400"
            }
            onClick={() => onLike(post.id)}
          >
            <ThumbsUp className="h-4 w-4 mr-1" />
            {post.likes}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 dark:text-gray-400"
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            {post.comments}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 dark:text-gray-400"
          >
            <Share2 className="h-4 w-4 mr-1" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className={
            post.isBookmarked
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400"
          }
          onClick={() => onBookmark(post.id)}
        >
          <BookmarkIcon className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

// Ad Card Component
function AdCard({ ad }) {
  return (
    <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-base">{ad.title}</CardTitle>
            <CardDescription className="text-xs">
              Sponsored by {ad.company}
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="text-xs bg-gray-100 dark:bg-gray-900"
          >
            Ad
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm mb-3">{ad.description}</p>
        <div className="rounded-md overflow-hidden border border-gray-200 dark:border-gray-800">
          <img
            src={ad.image || "/placeholder.svg"}
            alt={ad.title}
            className="w-full h-auto object-cover"
          />
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button className="w-full" asChild>
          <a href={ad.link} target="_blank" rel="noopener noreferrer">
            {ad.cta}
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
