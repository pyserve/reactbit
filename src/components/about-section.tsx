"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { useSessionStore } from "@/lib/sessionStore";
import { formatDateTime } from "@/lib/utils";
import { UserType } from "@/schemas";
import {
  Calendar,
  Edit,
  ExternalLink,
  Globe,
  MapPin,
  User,
} from "lucide-react";
import { useState } from "react";
import { EditProfileForm } from "./edit-profile-form";
import { Dialog, DialogTrigger } from "./ui/dialog";

export default function AboutSection({ user }: { user: UserType }) {
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const session = useSessionStore((s) => s.session);

  return (
    <TabsContent value="about" className="mt-6">
      <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg py-0">
        <CardHeader className="flex justify-between items-center py-5 px-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <CardTitle className="text-lg font-semibold">
              About {user?.first_name || user?.username || user?.email}
            </CardTitle>
          </div>
          {session?.user?.id === user?.id && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-gray-200 dark:border-gray-800 text-sm"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <EditProfileForm user={user} />
            </Dialog>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            <div className="p-5 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-900/30">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                  <User className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                    Bio
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {user?.bio || (
                      <span className="flex items-center gap-2 text-gray-400 dark:text-gray-500 italic text-sm py-1">
                        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></span>
                        No bio provided
                        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></span>
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-900/30">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                  <MapPin className="w-4 h-4 text-green-500 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                    Location
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {user?.address || (
                      <span className="flex items-center gap-2 text-gray-400 dark:text-gray-500 italic text-sm py-1">
                        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></span>
                        Not specified
                        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></span>
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-900/30">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-md">
                  <Globe className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                    Website
                  </h3>
                  {user?.website ? (
                    <div
                      className="group flex items-center gap-1"
                      onMouseEnter={() => setIsHovering("website")}
                      onMouseLeave={() => setIsHovering(null)}
                    >
                      <a
                        href={`https://${user?.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 dark:text-purple-400 group-hover:underline text-sm flex items-center"
                      >
                        {user?.website}
                        <ExternalLink
                          className={`w-3 h-3 ml-1 transition-opacity duration-200 ${
                            isHovering === "website"
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                      </a>
                    </div>
                  ) : (
                    <span className="flex items-center gap-2 text-gray-400 dark:text-gray-500 italic text-sm py-1">
                      <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></span>
                      Not provided
                      <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-5 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-900/30">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-md">
                  <Calendar className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                    Joined
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {formatDateTime(user?.date_joined)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
