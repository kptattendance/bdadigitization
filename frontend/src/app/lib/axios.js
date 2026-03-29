import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  console.log("API CALL:", config.baseURL + config.url);
  return config;
});
export default api;
