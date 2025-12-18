import axios from "axios";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const api = axios.create({
    baseURL: config.public.apiBaseUrl,
  });

  api.interceptors.request.use((req) => {
    const token = useCookie("token").value;

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  });

  return {
    provide: {
      api,
    },
  };
});
