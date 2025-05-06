import { LoginFormSchemaType } from "@/schemas/login-schema";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import pkg from "../../package.json";

export const useLogin = () =>
  useMutation({
    mutationFn: async (data: LoginFormSchemaType) => {
      try {
        const res = await axios.post(`${pkg.backend_url}/auth/token/`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const token = res?.data?.token;
        if (token) {
          const res1 = await axios.get(
            `${pkg.backend_url}/users/?username=${data?.username}`,
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          );
          return { token, user: { ...res1?.data?.[0] } };
        }
        return null;
      } catch (error: any) {
        const errorMessage =
          error.response.data?.["non_field_errors"]?.[0] ||
          error?.response?.data?.message ||
          error?.message ||
          "Error";
        console.log("🚀 ~ mutationFn: ~ errorMessage:", errorMessage);
        throw new Error(errorMessage);
      }
    },
  });
