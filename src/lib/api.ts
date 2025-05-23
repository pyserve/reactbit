import { backend_url } from "@/contexts";
import axios from "axios";
import { useSessionStore } from "./sessionStore";

export const api = axios.create({
  baseURL: backend_url,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const session = useSessionStore.getState().session;

    if (session?.token) {
      config.headers.Authorization = `Token ${session.token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => Promise.reject(error)
);
