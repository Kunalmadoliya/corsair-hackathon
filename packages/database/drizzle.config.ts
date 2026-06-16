import { defineConfig } from "drizzle-kit";
import { env } from "./env";

console.log(env.DATABASE_URL)

export default defineConfig({
  out: "./drizzle",
  schema: "./schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
    
  },
});
