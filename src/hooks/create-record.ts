import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [],
    mutationFn: async (data: any) => {
      try {
        const res = await api.post(data.url, data.data);
        return res.data;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    onSuccess: (_data, variables) => {
      if (variables?.url == "/conversations/") {
        queryClient.invalidateQueries({ queryKey: ["Conversation"] });
      }
      if (variables?.url == "/messages/") {
        queryClient.invalidateQueries({ queryKey: ["Message"] });
      }
    },
  });
};
