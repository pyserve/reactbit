import { Search } from "lucide-react";
import { Input } from "./ui/input";

export default function GlobalSearch() {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
      <Input
        placeholder="Search connections and posts?.data?..."
        value={""}
        onChange={(e) => console.log(e)}
        className="pl-10 bg-transparent border-gray-200 dark:border-gray-800"
      />
    </div>
  );
}
