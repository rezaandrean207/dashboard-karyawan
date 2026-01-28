import axios from "axios";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const apiDev = config.public.apiBaseUrl;
  const apiLocal = "http://192.168.1.70:8001";

  const api = axios.create({
    baseURL: apiLocal,
  });

  api.interceptors.request.use((req) => {
    if (typeof window !== "undefined") {
      const token = useCookie("token").value;
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
