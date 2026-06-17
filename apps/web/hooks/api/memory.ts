import { trpc } from "~/trpc/client";

export const useGetMemory = () => {
    const { data, isLoading, error, refetch } = trpc.memory.getMemory.useQuery({});
    return { data, isLoading, error, refetch };
}

export const useUpsertMemory = () => {
    const utils = trpc.useUtils();
    const { mutateAsync: upsertMemoryAsync, mutate: upsertMemory, isPending, error, data } = trpc.memory.upsertMemory.useMutation({
        onSuccess: () => {
            utils.memory.getMemory.invalidate();
        }
    });
    return { upsertMemoryAsync, upsertMemory, isPending, error, data };
}

export const useDeleteMemory = () => {
    const utils = trpc.useUtils();
    const { mutateAsync: deleteMemoryAsync, mutate: deleteMemory, isPending, error, data } = trpc.memory.deleteMemory.useMutation({
        onSuccess: () => {
            utils.memory.getMemory.invalidate();
        }
    });
    return { deleteMemoryAsync, deleteMemory, isPending, error, data };
}
