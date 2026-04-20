import { NSelect, NInput, NDatePicker } from "naive-ui";
import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("NSelect", NSelect);
  nuxtApp.vueApp.component("NInput", NInput);
  nuxtApp.vueApp.component("NDatePicker", NDatePicker);
});
