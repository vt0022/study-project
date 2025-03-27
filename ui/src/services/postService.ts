import { axiosClient } from "@/config/axios";

const postService = {
  getPostsForUser: async (page: number, size: number) => {
    return axiosClient
      .get("/posts/home", { params: { page, size } })
      .then((response) => response.data);
  },
};

export default postService;
