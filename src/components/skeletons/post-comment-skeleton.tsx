import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle } from "lucide-react";

export default function PostCommentSkeleton() {
  return (
    <Card className="relative w-full bg-white rounded-md shadow-md border p-0">
      <CardContent className="sticky top-0 bg-white z-10 border-b p-0">
        <div className="flex items-center space-x-2 p-4">
          <Skeleton className="h-20 flex-grow rounded-md" />
          <div className="grid gap-1">
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
        </div>
      </CardContent>

      <CardContent className="overflow-y-auto max-h-100 relative p-0">
        <CardTitle className="sticky top-0 bg-white p-2 px-4 z-1 flex items-center gap-2 pt-0 border-b border-gray-50">
          <MessageCircle size={20} /> Post Comments
        </CardTitle>
        <div className="space-y-4 p-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
