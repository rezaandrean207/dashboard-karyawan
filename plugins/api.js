import axios from "axios";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const api = axios.create({
    baseURL: config.public.apiBaseUrl,
  });

  // const apiTes = axios.create({
  //   baseURL: "http://192.168.0.102:8001",
  // });

  api.interceptors.request.use((req) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        req.headers.Authorization = `Bearer ${token}`;
      }
    }
    return req;
  });

  return {
    provide: {
      api,
      // apiTes,
    },
  };
});
