import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

// 导入 element-plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
// 引入 element-plus icon 图标
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

// 应用程序
const app = createApp(App);

// 全局注册 element-plus
app.use(ElementPlus);

// 注册 icon 所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

// 绑定 dom 节点
app.mount("#app");
