import { api } from "@/lib/api";
import { DataType } from "@/schemas";
import { useQuery } from "@tanstack/react-query";

export const useFetchRecords = (data: DataType) => {
  const q = data.query?.[0];
  const queryStr = q ? `?${q.key}${q.operator || "="}${q.value}` : "";
  const url = `/${data.model.toLowerCase()}s/${queryStr}`;

  return useQuery({
    queryKey: [data.model, data.query],
    queryFn: async () => {
      try {
        const res = await api.get(url);
        return res.data ?? [];
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    enabled: !!data.model,
  });
};
