import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" works for both <user>.github.io and <user>.github.io/<repo>
export default defineConfig({
  base: "./",
  plugins: [react()],
});
