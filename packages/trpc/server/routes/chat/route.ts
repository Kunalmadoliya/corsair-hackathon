import { z } from "../../schema";
import { chatService } from "../../services";
import { authenticatedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";

import * as Models from "./model";

const TAGS = ["Chat"];
const getPath = generatePath("/chat");

export const chatRouter = router({
    createChat: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/createChat"), tags: TAGS }
    }).input(Models.createChatInputType).output(Models.createChatOutputType)
    .mutation(async ({ ctx, input }) => {
        return chatService.createChat(ctx.user.id, input.title);
    }),

    listChats: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/listChats"), tags: TAGS }
    }).input(Models.listChatsInputType).output(Models.listChatsOutputType)
    .query(async ({ ctx }) => {
        return chatService.listChats(ctx.user.id);
    }),

    getChat: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/getChat"), tags: TAGS }
    }).input(Models.getChatInputType).output(Models.getChatOutputType)
    .query(async ({ ctx, input }) => {
        return chatService.getChat(ctx.user.id, input.chatId);
    }),

    deleteChat: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/deleteChat"), tags: TAGS }
    }).input(Models.deleteChatInputType).output(Models.deleteChatOutputType)
    .mutation(async ({ ctx, input }) => {
        return chatService.deleteChat(ctx.user.id, input.chatId);
    }),

    renameChat: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/renameChat"), tags: TAGS }
    }).input(Models.renameChatInputType).output(Models.renameChatOutputType)
    .mutation(async ({ ctx, input }) => {
        return chatService.renameChat(ctx.user.id, input.chatId, input.title);
    }),

    addMessage: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/addMessage"), tags: TAGS }
    }).input(Models.addMessageInputType).output(Models.addMessageOutputType)
    .mutation(async ({ ctx, input }) => {
        // Validation could be added here to ensure the user owns the chat
        return chatService.addMessage(input.chatId, input.role, input.content);
    }),
});
