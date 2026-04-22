import { NSelect, NInput, NDatePicker, NConfigProvider } from "naive-ui";
import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("NSelect", NSelect);
  nuxtApp.vueApp.component("NInput", NInput);
  nuxtApp.vueApp.component("NDatePicker", NDatePicker);
  nuxtApp.vueApp.component("NConfigProvider", NConfigProvider);
});
