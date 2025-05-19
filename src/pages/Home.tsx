import ConnectionCard from "@/components/connection-card";
import { CreatePostForm } from "@/components/create-post-form";
import Header from "@/components/nav-header";
import PostList from "@/components/post-list";
import { Button } from "@/components/ui/button";
import { useFetchRecords } from "@/hooks/fetch-records";
import { useSessionStore } from "@/lib/sessionStore";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const session = useSessionStore((state) => state.session);

  const { data: posts } = useFetchRecords({
    model: "Post",
    query: [
      {
        key: "user__in",
        operator: "=",
        value: [
          session?.user?.id,
          ...(session?.user?.followers ?? []),
          ...(session?.user?.following ?? []),
        ]
          .filter(Boolean)
          .join(","),
      },
    ],
  });

  const [IsLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Header />
      <main className="max-w-[96%] sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%] mx-auto pb-10">
        <div className="flex items-center justify-between py-4">
          <h3 className="text-xl font-bold capitalize">
            Welcome,{" "}
            {session?.user?.display_name || session?.user?.username || "User"}
          </h3>
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
              className={`h-4 w-4 ${IsLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>

        <div className="grid gap-2 lg:gap-4 grid-cols-1 lg:grid-cols-12">
          <div className="col-span-12 md:col-span-8 lg:col-span-7 space-y-6">
            <CreatePostForm />

            <PostList posts={posts} />
          </div>

          <div className="col-span-12 md:col-span-4 lg:col-span-5">
            <div className="sticky top-24">
              <ConnectionCard
                followers={session?.user?.followers ?? []}
                following={session?.user?.following ?? []}
                suggestions={session?.user?.suggestions ?? []}
                IsLoading={IsLoading}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
