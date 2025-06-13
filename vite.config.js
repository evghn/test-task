import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/

// export default defineConfig({
//   plugins: [vue(), vueDevTools()],
//   resolve: {
//     alias: {
//       "@": fileURLToPath(new URL("./src", import.meta.url)),
//     },
//   },
// });

export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://max220mm.beget.tech",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        // Дополнительные настройки если нужно:
        secure: false, // если используете самоподписанные сертификаты
        // configure: (proxy, options) => {
        //   // Дополнительная конфигурация если нужно
        // },
      },
    },
  },
});
