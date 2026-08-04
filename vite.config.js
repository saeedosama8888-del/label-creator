import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      fontkit: resolve(__dirname, "node_modules/fontkit/dist/browser.cjs"),
      "cross-fetch": resolve(__dirname, "src/cross-fetch.js"),
      "abs-svg-path": resolve(__dirname, "src/abs-svg-path.js"),
    },
  },
  optimizeDeps: {
    include: ["color-string", "color"],
    exclude: ["bwip-js"],
  },
  build: {
    chunkSizeWarningLimit: 5000,
    rollupOptions: {
      external: [],
    },
    commonjsOptions: {
      exclude: ["bwip-js"],
    },
  },
});
