import { axiosClient } from "@/config/axios";

const postService = {
  test: async () => {
    return axiosClient.get("/posts/test").then((response) => response.data);
  },
};

export default postService;
