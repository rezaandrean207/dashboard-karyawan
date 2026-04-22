import axios from "axios";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const apiDev = config.public.apiBaseUrl;

  const api = axios.create({
    baseURL: apiDev,
  });

  // ✅ Request interceptor (sudah ada, tetap sama)
  api.interceptors.request.use((req) => {
    if (typeof window !== "undefined") {
      const token = useCookie("token").value;
      if (token) {
        req.headers.Authorization = `Bearer ${token}`;
      }
    }
    return req;
  });

  // 🔥 Tambahkan ini
  api.interceptors.response.use(
    (res) => res, // kalau sukses, langsung return
    (error) => {
      if (error.response?.status === 401) {
        // Hapus semua cookie
        useCookie("token").value = null;
        useCookie("role").value = null;
        useCookie("clickup_id").value = null;
        useCookie("name").value = null;

        // Redirect ke login
        const router = useRouter();
        router.replace("/login");
      }

      return Promise.reject(error); // tetap reject biar catch di komponen jalan
    },
  );

  return {
    provide: { api },
  };
});
