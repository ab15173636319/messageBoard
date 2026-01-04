import { createApp, provide } from "vue";
import pinia from "./stores";
import App from "./App.vue";
import "./App.css";
import router from "./router";
import config from "../config";
import directives from "./directive";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

// 提供配置
const CONFIG = config;
provide("CONFIG", CONFIG);

const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(router);
app.use(ElementPlus, {
  locale: zhCn,
});
app.use(directives);
app.use(pinia);
app.mount("#app");
