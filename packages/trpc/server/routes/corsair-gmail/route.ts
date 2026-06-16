import { z, zodUndefinedModel } from "../../schema";
import { corsairGmailService } from "../../services";
import {
  getAuthenticationMethodOutputSchema,


} from "@repo/services/user/model";
import { publicProcedure, authenticatedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { env } from "@repo/services/env";


import {
    connectGmailInputType,
    connectGmailOutputType,
    gmailCallbackInputType,
    gmailCallbackOutputType,
    readGmailInputType,
    readGmailOutputType
} from "./model"

const TAGS = ["Corsair Gmail"]
const getPath = generatePath("/corsair-gmail")


export const corsairGmailRouter = router({

    connectGmail : authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/connectGmail"), tags: TAGS }
    }).input(connectGmailInputType)
    .output(connectGmailOutputType)
    .mutation(async ({ input }) => {
        const { id } = input
        const { url } = await corsairGmailService.connectGmail(id)
        return { url }
    }),

    gmailCallback : authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/gmailCallback"), tags: TAGS }
    }).input(gmailCallbackInputType)
    .output(gmailCallbackOutputType)
    .mutation(async ({ input }) => {
        const { code, state } = input
        const { url } = await corsairGmailService.gmailCallback(code, state)
        return { url }
    }),

    readGmail : authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/readGmail"), tags: TAGS }
    }).input(readGmailInputType)
    .output(readGmailOutputType)
    .mutation(async ({ input }) => {
        const { id } = input
        const { readInboxes } = await corsairGmailService.readGmail(id)
        return { inboxes: readInboxes }
    }),
    
})
