import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/index.ts"],
  format: ["esm"],

  noExternal: [/^@repo\//],
  external: [
    /^@corsair-dev\//,
    /^@openai\//,
    "bcryptjs",
    "corsair",
    "dotenv",
    "google-auth-library",
    "jsonwebtoken",
    "resend",
    "zod",
    "drizzle-orm",
    "pg",
    "winston",
  ],
  splitting: false,
  bundle: true,
  outDir: "./dist",
  clean: true,
  env: { IS_SERVER_BUILD: "true" },
  loader: { ".json": "copy" },
  minify: true,
  sourcemap: false,
});