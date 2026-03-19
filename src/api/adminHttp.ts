import axios from "axios";

const baseURL = typeof window === "undefined"
  ? process.env.SERVER_URL || ""
  : (process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:4000");

export const adminHttp = axios.create({ baseURL, timeout: 10000 });

// Auto-attach admin token on every request
adminHttp.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("ojs_admin_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

adminHttp.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error?.response?.data?.message || error.message || "Request failed";
    return Promise.reject(new Error(message));
  }
);

export default adminHttp;
