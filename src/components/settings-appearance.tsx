import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Moon, Sun } from "lucide-react";

import { Theme, useTheme } from "@/components/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "./ui/label";

export default function AppearanceSettings({
  setFormSubmitted,
}: {
  setFormSubmitted: (submitted: boolean) => void;
}) {
  const { setTheme } = useTheme();

  const toggleTheme = (value: Theme) => {
    setTheme(value);
    setFormSubmitted(true);
  };

  return (
    <TabsContent value="appearance">
      <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
        <CardHeader>
          <CardTitle>Appearance Settings</CardTitle>
          <CardDescription>
            Customize how the application looks and feels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Background Theme</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enable or disable the appearance theme.
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => toggleTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
