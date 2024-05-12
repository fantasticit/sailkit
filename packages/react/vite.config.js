import { resolve } from "path";
import { defineConfig } from "vite";
import compress from "vite-plugin-compression";
import dts from "vite-plugin-dts";

const FileName = {
  es: "index.js",
  cjs: "index.cjs",
  umd: "index.umd.js",
};

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
      formats: ["es", "cjs", "umd"],
      fileName: (format) => FileName[format],
      name: "SailkitReact",
    },
    rollupOptions: {
      external: ["@sailkit/core", "@sailkit/bubble-menu", "react", "react-dom"],
      output: {
        globals: {
          "@sailkit/core": "Sailkit",
          "@sailkit/bubble-menu": "SailkitBubbleMenu",
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
  resolve: { alias: { src: resolve("src/") } },
  plugins: [dts(), compress()],
});
