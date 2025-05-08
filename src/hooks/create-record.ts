import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [],
    mutationFn: async (data: any) => {
      try {
        const res = await api.post("/conversations/", data);
        return res.data;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["Conversation"] }),
  });
};
