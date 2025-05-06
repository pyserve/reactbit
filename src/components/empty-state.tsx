import { Users } from "lucide-react";

export default function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <Users className="h-12 w-12 text-gray-400" />
      <h3 className="mt-4 text-lg font-medium">{title}</h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}
