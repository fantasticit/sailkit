import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  // eslint-disable-next-line no-undef
  build: { lib: { entry: resolve(__dirname, "src/main.ts"), formats: ["es"] } },
  resolve: { alias: { src: resolve("src/") } },
  plugins: [dts()],
});
