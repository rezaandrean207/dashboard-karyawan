import axios from "axios";

export default defineNuxtPlugin(() => {
  const api = axios.create({
    baseURL: "https://go-kinerja-backend-production.up.railway.app",
    // baseURL: "http://192.168.110.172.0.102:8001",
    // baseURL: "",
  });

  const api2 = axios.create({
    // baseURL: "http://192.168.0.102:8001",
    baseURL: "http://192.168.0.102:8001",
  });

  return {
    provide: {
      api,
      api2,
    },
  };
});
