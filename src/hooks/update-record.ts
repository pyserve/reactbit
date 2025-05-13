import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

type UpdateDataType = {
  model: string;
  recordId?: number;
  data: Record<string, any>;
};

export const useUpdateRecord = () =>
  useMutation({
    mutationFn: async (data: UpdateDataType) => {
      try {
        if (!data.model.trim()) throw new Error("Model name not provided");
        if (!data?.recordId) throw new Error("Record Id name not provided");
        const res = await api.patch(
          `/${data.model.toLowerCase()}s/${data.recordId}/`,
          data.data
        );
        console.log("🚀 ~ mutationFn: ~ res:", res);
        return res.data;
      } catch (error) {
        throw new Error(
          error instanceof Error
            ? JSON.stringify(Object.values(error?.response?.data).join(", "))
            : "Error"
        );
      }
    },
  });
