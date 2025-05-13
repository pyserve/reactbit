import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUpdateRecord } from "@/hooks/update-record";
import { useSessionStore } from "@/lib/sessionStore";
import { UserType } from "@/schemas";
import {
  EditProfileFormSchemaType,
  EditProfileSchema,
} from "@/schemas/edit-profile-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Textarea } from "./ui/textarea";

export function EditProfileForm({ user }: { user?: UserType }) {
  const session = useSessionStore((s) => s.session);
  const setSession = useSessionStore((s) => s.setSession);
  const form = useForm<EditProfileFormSchemaType>({
    resolver: zodResolver(EditProfileSchema),
  });
  const [IsLoading, setIsLoading] = useState(false);
  const updateRecord = useUpdateRecord();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const fieldKeys = Object.keys(EditProfileSchema.shape) as Array<
        keyof EditProfileFormSchemaType
      >;
      fieldKeys.forEach((key) => {
        form.setValue(key, user[key as keyof UserType] ?? ("" as any));
      });
    }
  }, [user]);

  const onSubmit = async (values: EditProfileFormSchemaType) => {
    setIsLoading(true);
    console.log("🚀 ~ onSubmit ~ values:", values);
    try {
      const updatedUser = await updateRecord.mutateAsync({
        model: "User",
        recordId: user?.id,
        data: values,
      });
      setSession(session?.token ?? "", updatedUser);
      window.location.href = `/profile/${updatedUser.username}`;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error");
    } finally {
      setIsLoading(false);
    }
  };

  console.log(form.formState.errors);

  return (
    <DialogContent className="sm:max-w-[40%]">
      <DialogHeader>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="display_name"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Display Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    className="col-span-3"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="col-start-2 col-span-3" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="@johndoe"
                    className="col-span-3"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="col-start-2 col-span-3" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="username@example.com"
                    className="col-span-3"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="col-start-2 col-span-3" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Bio</FormLabel>
                <FormControl>
                  <Textarea placeholder="" className="col-span-3" {...field} />
                </FormControl>
                <FormMessage className="col-start-2 col-span-3" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Location</FormLabel>
                <FormControl>
                  <Input
                    placeholder="2 Medley Cres, Scarborough, ON"
                    className="col-span-3"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="col-start-2 col-span-3" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Website</FormLabel>
                <FormControl>
                  <Input
                    placeholder="http://localhost:5173/"
                    className="col-span-3"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="col-start-2 col-span-3" />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button type="submit" disabled={IsLoading}>
              {IsLoading ? (
                <div className="flex gap-2">
                  <Loader2 className="animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
