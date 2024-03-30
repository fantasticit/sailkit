import { resolve } from "path";
import { defineConfig } from "vite";
import compress from "vite-plugin-compression";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
      formats: ["es", "cjs"],
      fileName: (format, entry) => `${entry}.${format}.js`,
    },
  },
  resolve: { alias: { src: resolve("src/") } },
  plugins: [dts(), compress()],
});
