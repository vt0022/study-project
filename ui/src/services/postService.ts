import { axiosClient } from "@/config/axios";

const postService = {
  getPostsForUser: async (page: number, size: number) => {
    return await axiosClient
      .get("/posts/home", { params: { page, size } })
      .then((response) => response.data);
  },

  createPost: async(data: FormData) => {
    return await axiosClient.post("/posts", data, { headers: { "Content-Type": "multipart/form-data" } }).then((response) => response.data);
  }
};

export default postService;
