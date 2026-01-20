import { defineNuxtPlugin } from "#app";
import Ganttastic from "vue-ganttastic";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Ganttastic);
});
