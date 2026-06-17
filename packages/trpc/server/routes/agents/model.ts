import { z } from "zod";

export const openaiagentInputModel = z.object({
    message: z.string().describe("Message from the user"),
    chatId: z.string().optional().describe("ID of the chat session"),
});

export type OpenAIAgentInputSchemaType = z.infer<
    typeof openaiagentInputModel
>;

export const openaiagentOutputModel = z.object({
    message: z.string().describe("Message from the assistant"),
    chatId: z.string().optional().describe("ID of the chat session"),
});

export type OpenAIAgentOutputSchemaType = z.infer<
    typeof openaiagentOutputModel
>;