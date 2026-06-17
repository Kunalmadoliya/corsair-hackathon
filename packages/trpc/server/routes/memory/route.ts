import { z } from "../../schema";
import { memoryService } from "../../services";
import { authenticatedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";

import * as Models from "./model";

const TAGS = ["Memory"];
const getPath = generatePath("/memory");

export const memoryRouter = router({
    getMemory: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/getMemory"), tags: TAGS }
    }).input(Models.getMemoryInputType).output(Models.getMemoryOutputType)
    .query(async ({ ctx }) => {
        return memoryService.getMemory(ctx.user.id);
    }),

    upsertMemory: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/upsertMemory"), tags: TAGS }
    }).input(Models.upsertMemoryInputType).output(Models.upsertMemoryOutputType)
    .mutation(async ({ ctx, input }) => {
        return memoryService.upsertMemory(ctx.user.id, input.key, input.value);
    }),

    deleteMemory: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/deleteMemory"), tags: TAGS }
    }).input(Models.deleteMemoryInputType).output(Models.deleteMemoryOutputType)
    .mutation(async ({ ctx, input }) => {
        return memoryService.deleteMemory(ctx.user.id, input.key);
    }),
});
