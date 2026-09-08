import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    css: true,
    // Run test files serially. A few Contact integration tests exercise an
    // async fetch flow with real timers + long userEvent.type sequences; under
    // heavy parallel file execution on some machines they intermittently exceed
    // their timeout. Serial execution makes the suite deterministic. (Tests are
    // fast — the whole suite still runs in well under two minutes.)
    fileParallelism: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
