import { axiosClient } from "../config/axios";

const authService = {
  login: async (email: string, password: string) => {
    return axiosClient
      .post("/auth/login", {
        email,
        password,
      })
      .then((response) => response.data);
  },

  register: async (
    email: string,
    password: string,
    confirmPassword: string,
    firstName: string,
    lastName: string
  ) => {
    return axiosClient
      .post("/auth/register", {
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
      })
      .then((response) => response.data);
  },

  verify: async (email: string, code: string) => {
    return axiosClient
      .post("/auth/verify", { email, code })
      .then((response) => response.data);
  },

  refreshToken: async () => {
    return axiosClient.post("/auth/refresh").then((response) => response.data);
  },
};

export default authService;
