import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        watchlist: resolve(__dirname, "src/pages/watchlist.html"),
        join: resolve(__dirname, "src/pages/join.html"),
        watchnow: resolve(__dirname, "src/pages/watchnow.html"),
        books: resolve(__dirname, "src/pages/books.html"),
      },
    },
  },
});
