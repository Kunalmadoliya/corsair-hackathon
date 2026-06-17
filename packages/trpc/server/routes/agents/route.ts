import { z, zodUndefinedModel } from "../../schema";
import { openAiChats, chatService, memoryService } from "../../services";
import { authenticatedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";

import { openaiagentInputModel, openaiagentOutputModel } from "./model";

const TAGS = ["Agents"];
const getPath = generatePath("/corsair-agents");

export const openaiagentsRouter = router({
    openaiagent: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/agent"), tags: TAGS }
    }).input(openaiagentInputModel)
      .output(openaiagentOutputModel)
      .mutation(async ({ input, ctx }) => {
        const { message, chatId } = input;
        if (typeof message !== "string") {
          return { message: "Invalid message" };
        }
        try {
          let activeChatId = chatId;
          if (!activeChatId) {
              const newChat = await chatService.createChat(ctx.user.id, message.slice(0, 30) + "...");
              activeChatId = newChat.chat!.id;
          }

          // Persist user message
          await chatService.addMessage(activeChatId, "user", message);

          // Get memory context
          const memorySummary = await memoryService.getSummary(ctx.user.id);

          const result = await openAiChats.agentsFunctionallity({ message, memorySummary }, ctx.user.id);

          if (result) {
            // Persist assistant message
            await chatService.addMessage(activeChatId, "assistant", result);
            return { message: result, chatId: activeChatId };
          }
          return { message: "No response from server", chatId: activeChatId };
        } catch (error: any) {
          return { message: error.message || "An error occurred while processing your request." };
        }
      })
    });