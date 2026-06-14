import { z } from "zod";

export const openaiagentInputModel = z.object({
    message: z.string().describe("Message from the user"),
});

export type OpenAIAgentInputSchemaType = z.infer<
    typeof openaiagentInputModel
>;

export const openaiagentOutputModel = z.object({
    message: z.string().describe("Message from the user"),
});

export type OpenAIAgentOutputSchemaType = z.infer<
    typeof openaiagentOutputModel
>;