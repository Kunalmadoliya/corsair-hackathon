import { z } from "zod";

// We need zodUndefinedModel, so we might need to import it.
// Wait, I can just use z.object({}).optional() or something?
// Actually in services I shouldn't import from trpc schemas. Let's just use z.object({_?: z.string().optional()}) or z.void() or z.any()
export const createChatInputType = z.object({
    title: z.string().optional()
});
export const createChatOutputType = z.object({
    chat: z.any()
});

export const listChatsInputType = z.object({});
export const listChatsOutputType = z.object({
    chats: z.any()
});

export const getChatInputType = z.object({
    chatId: z.string()
});
export const getChatOutputType = z.object({
    chat: z.any(),
    messages: z.any()
});

export const deleteChatInputType = z.object({
    chatId: z.string()
});
export const deleteChatOutputType = z.object({
    success: z.boolean()
});

export const renameChatInputType = z.object({
    chatId: z.string(),
    title: z.string()
});
export const renameChatOutputType = z.object({
    chat: z.any()
});

export const addMessageInputType = z.object({
    chatId: z.string(),
    role: z.string(),
    content: z.string()
});
export const addMessageOutputType = z.object({
    message: z.any()
});
