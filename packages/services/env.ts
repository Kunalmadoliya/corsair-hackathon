import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().describe("DB URL"),
  CORSAIR_KEK: z.string().describe("CORSAIR KEK"),
  GITHUB_TOKEN : z.string().describe("GITHUB TOKEN"),
  GOOGLE_OAUTH_CLIENT_ID: z.string().optional(),
  GOOGLE_OAUTH_CLIENT_SECRET: z.string().optional(),
  GOOGLE_OAUTH_REDIRECT_URI: z.string().optional(),
  GITHUB_OAUTH_CLIENT_ID: z.string().optional(),
  GITHUB_OAUTH_CLIENT_SECRET: z.string().optional(),
  GITHUB_OAUTH_REDIRECT_URI: z.string().optional(),
  JWT_SECRET: z.string(),
  RESEND_API_KEY: z.string(),
  EMAIL_FROM: z.string(),
  BASE_URL: z.string() , 
  WEB_URL :z.string() ,
  NODE_ENV : z.string()
});

function createEnv(env: NodeJS.ProcessEnv) {
  const safeParseResult = envSchema.safeParse(env);
  if (!safeParseResult.success) throw new Error(safeParseResult.error.message);
  return safeParseResult.data;
}

export const env = createEnv(process.env);
