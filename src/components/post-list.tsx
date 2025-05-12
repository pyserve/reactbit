import { PostType } from "@/schemas";
import { useEffect, useRef, useState } from "react";
import PostCard from "./post-card";
import PostCardSkeleton from "./skeletons/post-card-skeleton";

export default function PostList({ posts }: { posts: PostType[] }) {
  const [visibility, setVisibility] = useState<boolean[]>(
    new Array(posts?.length)?.fill(false)
  );

  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries?.forEach((entry) => {
          const index = posts.findIndex(
            (post) =>
              post.id === parseInt(entry.target.id.replace("postElement-", ""))
          );

          if (entry.isIntersecting) {
            setVisibility((prev) => {
              const newVisibility = [...prev];
              newVisibility[index] = true; // Mark the post as visible
              return newVisibility;
            });
          }
        });
      },
      {
        rootMargin: "0px",
        threshold: 0.5,
      }
    );

    posts?.forEach((post, index) => {
      const element = document.getElementById(`postElement-${post.id}`);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    // Cleanup observer
    return () => {
      if (observerRef.current) {
        posts?.forEach((post) => {
          const element = document.getElementById(`postElement-${post.id}`);
          if (element) {
            observerRef.current?.unobserve(element);
          }
        });
      }
    };
  }, [posts]);

  return (
    <div className="space-y-6">
      {posts?.map((post, index) => (
        <div key={post.id} id={`postElement-${post.id}`}>
          {visibility[index] ? <PostCard post={post} /> : <PostCardSkeleton />}
        </div>
      ))}
    </div>
  );
}
