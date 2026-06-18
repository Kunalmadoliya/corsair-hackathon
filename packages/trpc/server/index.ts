import { router } from "./trpc";

import { healthRouter } from "./routes/health/route";
import { authRouter } from "./routes/auth/route";
import { openaiagentsRouter } from "./routes/agents/route";
import { corsairGmailRouter } from "./routes/corsair-gmail/route";
import { corsairCalendarRouter } from "./routes/corsair-calendar/route";
import { chatRouter } from "./routes/chat/route";
import { memoryRouter } from "./routes/memory/route";
import { syncRouter } from "./routes/sync/route";
import { userRouter } from "./routes/user/route";

export const serverRouter = router({
  health: healthRouter,
  auth: authRouter,
  openaiagents: openaiagentsRouter, 
  corsairGmail: corsairGmailRouter,
  corsairCalendar: corsairCalendarRouter,
  chat: chatRouter,
  memory: memoryRouter,
  sync: syncRouter,
  user: userRouter
});
export { createContext } from "./context";
export type ServerRouter = typeof serverRouter;
