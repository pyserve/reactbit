import { api } from "@/lib/api";
import { UserType } from "@/schemas";
import { useMutation } from "@tanstack/react-query";

export type UserConnectionDataType = {
  current: UserType;
  other: UserType;
  actionType: string;
};

export const useConnectUser = () => {
  return useMutation({
    mutationKey: ["Connect_User"],
    mutationFn: async (data: UserConnectionDataType) => {
      console.log("🚀 ~ mutationFn: ~ data:", data);
      try {
        let newFollowing: number[] = [];
        if (data.actionType == "follow") {
          newFollowing = [...data.other.following, data.current?.id];
        }
        if (data.actionType == "unfollow") {
          newFollowing = data.other.followers.filter(
            (u) => u !== data.current.id
          );
        }
        const res = await api.patch(`/users/${data.other?.id}/`, {
          followers: newFollowing,
        });
        console.log("🚀 ~ mutationFn: ~ res:", res);
        const res2 = await api.get(`/users/${data.current?.id}/`);
        console.log("🚀 ~ mutationFn: ~ res2:", res2);
        return res2.data ?? data.current;
      } catch (error) {
        throw error instanceof Error
          ? error
          : new Error("An unknown error occurred");
      }
    },
  });
};
