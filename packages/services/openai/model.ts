import { z } from "zod";

export const openaiagentInputModel = z.object({
  message: z.string().describe("Message from the user"),
  memorySummary: z.string().optional().describe("User memory summary"),
  chatHistory: z.array(z.object({
    role: z.string(),
    content: z.string()
  })).optional().describe("Previous messages in the conversation")
});

export type OpenAIAgentInputSchemaType = z.infer<
  typeof openaiagentInputModel
>;