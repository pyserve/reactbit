import { getSession } from "@/hooks/use-session";
import axios from "axios";
import pkg from "../../package.json";

export const api = axios.create({
  baseURL: pkg.backend_url,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const session = getSession();
    if (session?.token) {
      config.headers.Authorization = `Token ${session.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
