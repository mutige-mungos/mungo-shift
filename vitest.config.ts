import { defineConfig } from "vitest/config";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
    },
  },
  test: {
    include: ["lib/**/*.test.{ts,tsx}", "lib/__tests__/**/*.{test,spec}.{ts,tsx}"],
    environment: "node",
    coverage: {
      reporter: ["text", "html"],
    },
  },
});
