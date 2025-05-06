import { api } from "@/lib/api";
import { LoginFormSchemaType } from "@/schemas/login-schema";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () =>
  useMutation({
    mutationFn: async (data: LoginFormSchemaType) => {
      try {
        const res = await api.post(`/auth/token/`, data);
        console.log("🚀 ~ mutationFn: ~ res:", res);
        const token = res?.data?.token;
        const res1 = await api.get(`/users/?username=${data?.username}`);
        return { token, user: { ...res1?.data?.[0] } };
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.["non_field_errors"]?.[0] ||
          error?.response?.data?.message ||
          error?.message ||
          "Error";
        console.log("🚀 ~ mutationFn: ~ errorMessage:", errorMessage);
        throw new Error(errorMessage);
      }
    },
  });
