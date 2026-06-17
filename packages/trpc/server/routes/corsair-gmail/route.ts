import { z } from "zod";
import { corsairGmailService } from "../../services";
import { publicProcedure, authenticatedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";

import * as Models from "./model";

const TAGS = ["Corsair Gmail"];
const getPath = generatePath("/corsair-gmail");

export const corsairGmailRouter = router({
    connectGmail: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/connectGmail"), tags: TAGS }
    }).input(Models.connectGmailInputType)
    .output(Models.connectGmailOutputType)
    .mutation(async ({ ctx }) => {
        const id = ctx.user.id;
        const { url } = await corsairGmailService.connectGmail(id);
        return { url };
    }),

    gmailCallback: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/gmailCallback"), tags: TAGS }
    }).input(Models.gmailCallbackInputType)
    .output(Models.gmailCallbackOutputType)
    .mutation(async ({ input }) => {
        const { code, state } = input;
        await corsairGmailService.gmailCallback(code, state);
        return { url: "/dashboard" };
    }),

    debugConnection: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/debugConnection"), tags: TAGS }
    }).input(z.object({})).output(z.any())
    .mutation(async ({ ctx }) => {
        try {
            const result = await corsairGmailService.listMessages(ctx.user.id, { maxResults: 5 });
            return {
                userId: ctx.user.id,
                tenantId: ctx.user.id,
                connectionStatus: "connected",
                tokenStatus: "valid",
                first5Messages: result
            };
        } catch (e: any) {
            return {
                userId: ctx.user.id,
                tenantId: ctx.user.id,
                connectionStatus: "error",
                tokenStatus: e.message || "invalid",
                first5Messages: null
            };
        }
    }),

    // Drafts
    createDraft: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/createDraft"), tags: TAGS }
    }).input(Models.createDraftInputType).output(Models.createDraftOutputType)
    .mutation(async ({ ctx, input }) => {
        return corsairGmailService.createDraft(ctx.user.id, input);
    }),

    deleteDraft: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/deleteDraft"), tags: TAGS }
    }).input(Models.deleteDraftInputType).output(Models.deleteDraftOutputType)
    .mutation(async ({ ctx, input }) => {
        return corsairGmailService.deleteDraft(ctx.user.id, input);
    }),

    getDraft: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/getDraft"), tags: TAGS }
    }).input(Models.getDraftInputType).output(Models.getDraftOutputType)
    .mutation(async ({ ctx, input }) => {
        return corsairGmailService.getDraft(ctx.user.id, input);
    }),

    listDrafts: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/listDrafts"), tags: TAGS }
    }).input(Models.listDraftsInputType).output(Models.listDraftsOutputType)
    .mutation(async ({ ctx, input }) => {
        return corsairGmailService.listDrafts(ctx.user.id, input);
    }),

    sendDraft: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/sendDraft"), tags: TAGS }
    }).input(Models.sendDraftInputType).output(Models.sendDraftOutputType)
    .mutation(async ({ ctx, input }) => {
        return corsairGmailService.sendDraft(ctx.user.id, input);
    }),

    updateDraft: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/updateDraft"), tags: TAGS }
    }).input(Models.updateDraftInputType).output(Models.updateDraftOutputType)
    .mutation(async ({ ctx, input }) => {
        return corsairGmailService.updateDraft(ctx.user.id, input);
    }),

    // Labels
    createLabel: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/createLabel"), tags: TAGS }
    }).input(Models.createLabelInputType).output(Models.createLabelOutputType)
    .mutation(async ({ ctx, input }) => {
        return corsairGmailService.createLabel(ctx.user.id, input);
    }),

    deleteLabel: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/deleteLabel"), tags: TAGS }
    }).input(Models.deleteLabelInputType).output(Models.deleteLabelOutputType)
    .mutation(async ({ ctx, input }) => {
        return corsairGmailService.deleteLabel(ctx.user.id, input);
    }),

    getLabel: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/getLabel"), tags: TAGS }
    }).input(Models.getLabelInputType).output(Models.getLabelOutputType)
    .mutation(async ({ ctx, input }) => {
        return corsairGmailService.getLabel(ctx.user.id, input);
    }),

    listLabels: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/listLabels"), tags: TAGS }
    }).input(Models.listLabelsInputType).output(Models.listLabelsOutputType)
    .mutation(async ({ ctx, input }) => {
        return corsairGmailService.listLabels(ctx.user.id, input);
    }),

    updateLabel: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/updateLabel"), tags: TAGS }
    }).input(Models.updateLabelInputType).output(Models.updateLabelOutputType)
    .mutation(async ({ ctx, input }) => {
        return corsairGmailService.updateLabel(ctx.user.id, input);
    }),

    // Messages
    batchModifyMessages: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/batchModifyMessages"), tags: TAGS }
    }).input(Models.batchModifyMessagesInputType).output(Models.batchModifyMessagesOutputType)
    .mutation(async ({ ctx, input }) => {
        return corsairGmailService.batchModifyMessages(ctx.user.id, input);
    }),

    deleteMessage: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/deleteMessage"), tags: TAGS }
    }).input(Models.deleteMessageInputType).output(Models.deleteMessageOutputType)
    .mutation(async ({ ctx, input }) => {
        return corsairGmailService.deleteMessage(ctx.user.id, input);
    }),

    getMessage: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/getMessage"), tags: TAGS }
    }).input(Models.getMessageInputType).output(Models.getMessageOutputType)
    .mutation(async ({ ctx, input }) => {
        return corsairGmailService.getMessage(ctx.user.id, input);
    }),

    listMessages: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/listMessages"), tags: TAGS }
    }).input(Models.listMessagesInputType).output(Models.listMessagesOutputType)
    .mutation(async ({ ctx, input }) => {
        return corsairGmailService.listMessages(ctx.user.id, input);
    }),

    modifyMessage: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/modifyMessage"), tags: TAGS }
    }).input(Models.modifyMessageInputType).output(Models.modifyMessageOutputType)
    .mutation(async ({ ctx, input }) => {
        return corsairGmailService.modifyMessage(ctx.user.id, input);
    }),

    sendMessage: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/sendMessage"), tags: TAGS }
    }).input(Models.sendMessageInputType).output(Models.sendMessageOutputType)
    .mutation(async ({ ctx, input }) => {
        return corsairGmailService.sendMessage(ctx.user.id, input);
    }),

    trashMessage: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/trashMessage"), tags: TAGS }
    }).input(Models.trashMessageInputType).output(Models.trashMessageOutputType)
    .mutation(async ({ ctx, input }) => {
        return corsairGmailService.trashMessage(ctx.user.id, input);
    }),

    untrashMessage: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/untrashMessage"), tags: TAGS }
    }).input(Models.untrashMessageInputType).output(Models.untrashMessageOutputType)
    .mutation(async ({ ctx, input }) => {
        return corsairGmailService.untrashMessage(ctx.user.id, input);
    }),

    // Threads
    deleteThread: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/deleteThread"), tags: TAGS }
    }).input(Models.deleteThreadInputType).output(Models.deleteThreadOutputType)
    .mutation(async ({ ctx, input }) => {
        return corsairGmailService.deleteThread(ctx.user.id, input);
    }),

    getThread: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/getThread"), tags: TAGS }
    }).input(Models.getThreadInputType).output(Models.getThreadOutputType)
    .mutation(async ({ ctx, input }) => {
        return corsairGmailService.getThread(ctx.user.id, input);
    }),

    listThreads: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/listThreads"), tags: TAGS }
    }).input(Models.listThreadsInputType).output(Models.listThreadsOutputType)
    .mutation(async ({ ctx, input }) => {
        return corsairGmailService.listThreads(ctx.user.id, input);
    }),

    modifyThread: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/modifyThread"), tags: TAGS }
    }).input(Models.modifyThreadInputType).output(Models.modifyThreadOutputType)
    .mutation(async ({ ctx, input }) => {
        return corsairGmailService.modifyThread(ctx.user.id, input);
    }),

    trashThread: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/trashThread"), tags: TAGS }
    }).input(Models.trashThreadInputType).output(Models.trashThreadOutputType)
    .mutation(async ({ ctx, input }) => {
        return corsairGmailService.trashThread(ctx.user.id, input);
    }),

    untrashThread: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/untrashThread"), tags: TAGS }
    }).input(Models.untrashThreadInputType).output(Models.untrashThreadOutputType)
    .mutation(async ({ ctx, input }) => {
        return corsairGmailService.untrashThread(ctx.user.id, input);
    }),
});
