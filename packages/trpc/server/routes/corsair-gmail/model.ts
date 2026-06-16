import { z } from "zod"


export const connectGmailInputType = z.object({
    id: z.string()
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

export const readGmailInputType = z.object({
    id: z.string()
})

export const readGmailOutputType = z.object({
    inboxes: z.object()
})