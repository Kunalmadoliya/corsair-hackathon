import { z } from "zod";

export const toggleDemoModeInputModel = z.object({
    isDemoMode: z.boolean()
});

export const toggleDemoModeOutputModel = z.object({
    success: z.boolean()
});
