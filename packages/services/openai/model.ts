import { z } from "zod";

export const openaiagentInputModel = z.object({
  message: z.string().describe("Message from the user"),
  memorySummary: z.string().optional().describe("User memory summary"),
});

export type OpenAIAgentInputSchemaType = z.infer<
  typeof openaiagentInputModel
>;