import { resolve } from "path";
import { defineConfig } from "vite";
import compress from "vite-plugin-compression";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  // eslint-disable-next-line no-undef
  build: {
    lib: {
      entry: "./src/index.ts",
      formats: ["es", "cjs", "umd", "iife"],
      fileName: (format, entry) => `${entry}.${format}.js`,
      name: "sailkit",
    },
  },
  resolve: { alias: { src: resolve("src/") } },
  plugins: [dts({ rollupTypes: true }), compress()],
});
