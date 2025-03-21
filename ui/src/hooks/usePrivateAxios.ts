import { axiosClient } from "@/config/axios";
import AuthService from "@/services/authService";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function usePrivateAxios() {
  const navigate = useNavigate();

  useEffect(() => {
    const requestInterceptor = axiosClient.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosClient.interceptors.response.use(
      async (response) => {
        // Save original request
        const originalRequest = response.config;

        // Token expired
        if (response.data.statusCode === 401) {
          try {
            // Get new access token
            const refreshCall = await AuthService.refreshToken();

            if (refreshCall.statusCode === 200) {
              // Retry
              return axiosClient(originalRequest);
            } else {
              navigate("/login");
            }
          } catch (error) {
            navigate("/login");
            return Promise.reject(error);
          }
        } else if (response.data.statusCode === 403) {
          // Forbidden
          navigate("/login");
        }

        return response;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axiosClient.interceptors.request.eject(requestInterceptor);
      axiosClient.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  return axiosClient;
}
