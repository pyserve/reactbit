import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PostCardSkeleton() {
  return (
    <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black overflow-hidden animate-pulse">
      <CardHeader className="pb-1">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-6 w-6 rounded-md" />
        </div>
      </CardHeader>

      <CardContent className="pb-1">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-60 w-full rounded-md mt-3" />
      </CardContent>

      <CardFooter className="border-t border-gray-100 dark:border-gray-900 pt-3 flex justify-between">
        <div className="flex gap-4">
          <Skeleton className="h-6 w-14 rounded-md" />
          <Skeleton className="h-6 w-14 rounded-md" />
          <Skeleton className="h-6 w-14 rounded-md" />
        </div>
        <Skeleton className="h-6 w-8 rounded-md" />
      </CardFooter>
    </Card>
  );
}
