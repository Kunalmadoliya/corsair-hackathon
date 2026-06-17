import { z } from "zod";

export const connectGmailInputType = z.object({
    id: z.string().optional()
})

export const connectGmailOutputType = z.object({
    url: z.string()
})

export const gmailCallbackInputType = z.object({
    code: z.string(),
    state: z.string()
})

export const gmailCallbackOutputType = z.object({
    url: z.string()
})

// Export everything from the service models for convenience
export * from "@repo/services/corsair/gmail/model";