import { axiosClient } from "@/config/axios";

const postService = {
  getPostsForUser: async (page: number, size: number) => {
    return await axiosClient
      .get("/posts/home", { params: { page, size } })
      .then((response) => response.data);
  },

  getMyPosts: async (page: number, size: number) => {
    return await axiosClient
      .get("/posts/me", { params: { page, size } })
      .then((response) => response.data);
  },

  createPost: async (data: FormData) => {
    return await axiosClient
      .post("/posts", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => response.data);
  },

  updatePost: async (postId: number, data: FormData) => {
    return await axiosClient
      .put(`/posts/${postId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => response.data);
  },

  likePost: async (postId: number) => {
    return await axiosClient
      .put(`/posts/${postId}/like`)
      .then((response) => response.data);
  },
};

export default postService;
