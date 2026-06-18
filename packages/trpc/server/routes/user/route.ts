import { authenticatedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { toggleDemoModeInputModel, toggleDemoModeOutputModel } from "./model";
import { db, eq } from "@repo/database";
import { usersTable, analyticsTable } from "@repo/database/schema";
import { z } from "zod";

const TAGS = ["User"];
const getPath = generatePath("/user");

export const userRouter = router({
  toggleDemoMode: authenticatedProcedure
    .meta({ openapi: { method: "POST", path: getPath("/toggleDemoMode"), tags: TAGS } })
    .input(toggleDemoModeInputModel)
    .output(toggleDemoModeOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { isDemoMode } = input;
      await db
        .update(usersTable)
        .set({ isDemoMode })
        .where(eq(usersTable.id, ctx.user.id));
        
      return { success: true };
    }),

  getAnalytics: authenticatedProcedure
    .meta({ openapi: { method: "GET", path: getPath("/getAnalytics"), tags: TAGS } })
    .input(z.undefined())
    .output(z.any())
    .query(async ({ ctx }) => {
      // Just returning mock for Demo Mode, or real logic if implemented
      const result = await db.select().from(analyticsTable).where(eq(analyticsTable.userId, ctx.user.id));
      return result;
    })
});
