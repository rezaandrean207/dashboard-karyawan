declare module "vue-ganttastic" {
  import { DefineComponent, App } from "vue";

  export const GanttChart: DefineComponent<any, any, any>;
  export const GanttRow: DefineComponent<any, any, any>;

  const plugin: {
    install(app: App): void;
  };

  export default plugin;
}
