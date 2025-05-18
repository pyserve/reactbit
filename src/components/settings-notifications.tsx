import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { Save } from "lucide-react";

import {
  NotificationSettingsForm,
  NotificationSettingsSchema,
} from "@/schemas/settings-schema";
import toast from "react-hot-toast";

export default function NotificationSettings({
  setFormSubmitted,
}: {
  setFormSubmitted: (submitted: boolean) => void;
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NotificationSettingsForm>({
    resolver: zodResolver(NotificationSettingsSchema),
    defaultValues: {
      emailAll: true,
      emailNewMessages: true,
      pushAll: true,
      pushNewMessages: true,
      pushNewFollowers: true,
      pushCommentsLikes: false,
    },
  });

  const onSubmit = (data: NotificationSettingsForm) => {
    console.log("Form data:", data);
    try {
      setFormSubmitted(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error");
    }
  };

  console.log("🚀 ~ errors:", errors);
  return (
    <TabsContent value="notifications">
      <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Manage how and when you receive notifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Email Notifications</h3>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">All Emails</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enable or disable all email notifications
                  </p>
                </div>
                <Controller
                  name="emailAll"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">New Messages</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive email notifications for new messages
                  </p>
                </div>
                <Controller
                  name="emailNewMessages"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>

              <Separator className="my-4" />

              <h3 className="text-lg font-medium">Push Notifications</h3>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">All Notifications</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enable or disable all push notifications
                  </p>
                </div>
                <Controller
                  name="pushAll"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">New Messages</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive push notifications for new messages
                  </p>
                </div>
                <Controller
                  name="pushNewMessages"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">New Followers</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive push notifications when someone follows you
                  </p>
                </div>
                <Controller
                  name="pushNewFollowers"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">
                    Comments or Likes on Posts
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive email notifications for comments on your posts
                  </p>
                </div>
                <Controller
                  name="pushCommentsLikes"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
