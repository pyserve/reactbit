import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { useUpdateRecord } from "@/hooks/update-record";
import { useSessionStore } from "@/lib/sessionStore";
import { cn } from "@/lib/utils";
import { SecuritySchema, SecuritySchemaType } from "@/schemas/settings-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Command, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function SecuritySettings({
  setFormSubmitted,
}: {
  setFormSubmitted: (submitted: boolean) => void;
}) {
  const session = useSessionStore((s) => s.session);
  const setSession = useSessionStore((s) => s.setSession);
  const updateRecord = useUpdateRecord();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SecuritySchemaType>({
    resolver: zodResolver(SecuritySchema),
  });

  const onSubmit = async (values: SecuritySchemaType) => {
    if (!session) return;
    try {
      const res = await updateRecord.mutateAsync({
        model: "User",
        recordId: session?.user?.id,
        data: values,
      });
      console.log("🚀 ~ onSubmit ~ res:", res);
      setFormSubmitted(true);
      setSession(session.token, res);
      toast.success("Account settings updated sucessfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error");
    }
  };
  console.log("🚀 ~ SecuritySettings ~ errors:", errors);

  return (
    <TabsContent value="security">
      <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>
            Manage your account security and login options.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertDescription className="flex gap-1 text-gray-900">
              <Command />
              <span>
                If you are logged in with your Google account, please reset your
                password by logging out and clicking <b>forgot password</b>.
              </span>
            </AlertDescription>
          </Alert>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Change Password</h3>

              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  {...register("current_password")}
                  className={cn(
                    "border-gray-200 dark:border-gray-800",
                    errors?.current_password &&
                      "border-red-500 ring-1 ring-red-500"
                  )}
                />
                {errors?.current_password && (
                  <p className="text-xs text-red-500">
                    {errors?.current_password?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  {...register("new_password")}
                  className={cn(
                    "border-gray-200 dark:border-gray-800",
                    errors?.new_password && "border-red-500 ring-1 ring-red-500"
                  )}
                />
                {errors?.new_password && (
                  <p className="text-xs text-red-500">
                    {errors?.new_password?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  {...register("confirm_password")}
                  className={cn(
                    "border-gray-200 dark:border-gray-800",
                    errors?.confirm_password &&
                      "border-red-500 ring-1 ring-red-500"
                  )}
                />
                {errors?.confirm_password && (
                  <p className="text-xs text-red-500">
                    {errors?.confirm_password?.message}
                  </p>
                )}
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
