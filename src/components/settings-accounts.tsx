import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSessionStore } from "@/lib/sessionStore";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";

import { useUpdateRecord } from "@/hooks/update-record";
import { AccountSchema, AccountSchemaType } from "@/schemas/settings-schema";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { TabsContent } from "./ui/tabs";
import { Textarea } from "./ui/textarea";

export default function AccountSettings({
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
  } = useForm<AccountSchemaType>({
    resolver: zodResolver(AccountSchema),
    defaultValues: {
      ...session?.user,
    },
  });

  const onSubmit = async (values: AccountSchemaType) => {
    console.log("🚀 ~ onsubmit ~ values:", values);
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
  console.log("🚀 ~ AccountSettings ~ errors:", errors);

  return (
    <TabsContent value="account">
      <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>
            Manage your account information and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">First Name</Label>
                  <Input
                    id="name"
                    placeholder="First name"
                    {...register("first_name")}
                    className={cn(
                      "border-gray-200 dark:border-gray-800",
                      errors?.first_name && "border-red-500 ring-1 ring-red-500"
                    )}
                  />
                  {errors?.first_name && (
                    <p className="text-xs text-red-500">
                      {errors?.first_name?.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Last Name</Label>
                  <Input
                    id="name"
                    placeholder="Last name."
                    {...register("last_name")}
                    className={cn(
                      "border-gray-200 dark:border-gray-800",
                      errors?.last_name && "border-red-500 ring-1 ring-red-500"
                    )}
                  />
                  {errors?.last_name && (
                    <p className="text-xs text-red-500">
                      {errors?.last_name?.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="@username"
                  {...register("username")}
                  className={cn(
                    "border-gray-200 dark:border-gray-800",
                    errors?.username && "border-red-500 ring-1 ring-red-500"
                  )}
                />
                {errors?.username && (
                  <p className="text-xs text-red-500">
                    {errors?.username?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  {...register("email")}
                  type="email"
                  placeholder="example.email@example.com"
                  className={cn(
                    "border-gray-200 dark:border-gray-800",
                    errors?.email && "border-red-500 ring-1 ring-red-500"
                  )}
                />
                {errors?.email && (
                  <p className="text-xs text-red-500">
                    {errors?.email?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Add a bio"
                  {...register("bio")}
                  className={cn(
                    "border-gray-200 dark:border-gray-800",
                    errors?.bio && "border-red-500 ring-1 ring-red-500"
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
