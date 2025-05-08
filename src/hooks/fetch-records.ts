import { api } from "@/lib/api";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

type QueryParam = {
  key: string;
  value: string | number | boolean | null | undefined;
  operator?: "=" | "!=" | ">" | "<" | ">=" | "<=";
};

type DataType = {
  model: string;
  query?: QueryParam[];
};

export const useFetchRecords = (
  data: DataType
): UseQueryResult<any[], Error> => {
  return useQuery({
    queryKey: [data.model],
    queryFn: async () => {
      const q = data.query?.[0];
      const queryStr = q ? `?${q.key}${q.operator || "="}${q.value}` : "";
      const res = await api.get(`/${data.model.toLowerCase()}s/${queryStr}`);
      return res?.data ?? [];
    },
  });
};
