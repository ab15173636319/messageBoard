import type { App } from "vue";

import { vReplay } from "./modules/vReplay";

export default {
  install(app: App) {
    app.directive("replay", vReplay);
  },
};
