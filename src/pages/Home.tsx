import ConnectionCard from "@/components/connection-card";
import { CreatePostForm } from "@/components/create-post-form";
import Header from "@/components/nav-header";
import PostCard from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { useFetchRecords } from "@/hooks/fetch-records";
import { getSession } from "@/hooks/use-session";
import { PostType } from "@/schemas";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const session = getSession();
  const { data: posts } = useFetchRecords({
    model: "Post",
    query: [
      {
        key: "user",
        value: session?.user?.id,
        operator: "=",
      },
    ],
  });
  const [IsLoading, setIsLoading] = useState(false);

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
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                }, 1000);
              }}
              disabled={IsLoading}
              className="border-gray-200 dark:border-gray-800"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${IsLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <CreatePostForm />

            <div className="space-y-6">
              {posts?.map((post: PostType) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          <ConnectionCard
            followers={session?.user?.followers}
            following={session?.user?.following}
            suggestions={session?.user?.suggestions}
            IsLoading={IsLoading}
          />
        </div>
      </main>
    </div>
  );
}
