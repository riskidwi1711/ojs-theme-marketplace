import axios from "axios";

// Axios instance for client-side requests
const baseURL = typeof window === 'undefined'
  ? (process.env.SERVER_URL || 'http://localhost:4000')
  : (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:4000');

export const http = axios.create({ baseURL, timeout: 10000 });

http.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error?.response?.data?.message || error.message || "Request failed";
    return Promise.reject(new Error(message));
  }
);

export default http;
