import { publicAxios } from "./axios";

const AuthService = {
    login: async (email: string, password: string) => {
        try {
            const response = await publicAxios.post("/auth/login", { email, password });
            return response.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    register: async (email: string, password: string, confirmPassword: string, firstName: string, lastName: string) => {
        return publicAxios.post("/auth/register", { email, password, confirmPassword, firstName, lastName }).then((response) => response.data);
    },

    verify: async (email: string, code: string) => {
        return publicAxios.post("/auth/verify", { email, code }).then((response) => response.data);
    },
};

export default AuthService;
