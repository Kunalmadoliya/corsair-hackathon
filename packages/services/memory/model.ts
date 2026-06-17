import { z } from "zod";

export const getMemoryInputType = z.object({});
export const getMemoryOutputType = z.object({
    memory: z.any()
});

export const upsertMemoryInputType = z.object({
    key: z.string(),
    value: z.any()
});
export const upsertMemoryOutputType = z.object({
    memory: z.any()
});

export const deleteMemoryInputType = z.object({
    key: z.string()
});
export const deleteMemoryOutputType = z.object({
    success: z.boolean()
});
