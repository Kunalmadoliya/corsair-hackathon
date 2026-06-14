import { router } from "./trpc";

import { healthRouter } from "./routes/health/route";
import { authRouter } from "./routes/auth/route";
import {openaiagentsRouter} from "./routes/agents/route"

export const serverRouter = router({
  health: healthRouter,
  auth: authRouter,
  openaiagents : openaiagentsRouter
});

export { createContext } from "./context";
export type ServerRouter = typeof serverRouter;
