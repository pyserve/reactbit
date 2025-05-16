import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export const useLikePost = () =>
  useMutation({
    mutationKey: ["PostLike"],
    mutationFn: async (data: any) => {
      try {
        console.log("🚀 ~ mutationFn:async ~ data:", data);
        const res = await api.post(`/post_reactions/`, data);
        return res.data;
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Error");
      }
    },
  });

export const useCommentPost = () =>
  useMutation({
    mutationKey: ["PostComment"],
    mutationFn: async (data: any) => {
      try {
        console.log("🚀 ~ mutationFn:async ~ data:", data);
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Error");
      }
    },
  });

export const useSavedPost = () =>
  useMutation({
    mutationKey: ["PostSaved"],
    mutationFn: async (data: any) => {
      try {
        console.log("🚀 ~ mutationFn:async ~ data:", data);
        const res = await api.post(`/saved_posts/`, data);
        return res.data;
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Error");
      }
    },
  });

export const useSharedPost = () =>
  useMutation({
    mutationKey: ["PostShared"],
    mutationFn: async (data: any) => {
      try {
        console.log("🚀 ~ mutationFn:async ~ data:", data);
        const res = await api.post(`/posts/`, data);
        return res.data;
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Error");
      }
    },
  });

export const usePostComment = () =>
  useMutation({
    mutationKey: ["PostComment"],
    mutationFn: async (data: any) => {
      try {
        console.log("🚀 ~ mutationFn:async ~ data:", data);
        const res = await api.post(`/post_comments/`, data);
        return res.data;
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Error");
      }
    },
  });
