import { trpc } from "~/trpc/client";

export const useCreateChat = () => {
    const utils = trpc.useUtils();
    const { mutateAsync: createChatAsync, mutate: createChat, isPending, error, data } = trpc.chat.createChat.useMutation({
        onSuccess: () => {
            utils.chat.listChats.invalidate();
        }
    });
    return { createChatAsync, createChat, isPending, error, data };
}

export const useListChats = () => {
    const { data, isLoading, error, refetch } = trpc.chat.listChats.useQuery({});
    return { data, isLoading, error, refetch };
}

export const useGetChat = (chatId: string) => {
    const { data, isLoading, error, refetch } = trpc.chat.getChat.useQuery({ chatId }, { enabled: !!chatId });
    return { data, isLoading, error, refetch };
}

export const useDeleteChat = () => {
    const utils = trpc.useUtils();
    const { mutateAsync: deleteChatAsync, mutate: deleteChat, isPending, error, data } = trpc.chat.deleteChat.useMutation({
        onSuccess: () => {
            utils.chat.listChats.invalidate();
        }
    });
    return { deleteChatAsync, deleteChat, isPending, error, data };
}

export const useRenameChat = () => {
    const utils = trpc.useUtils();
    const { mutateAsync: renameChatAsync, mutate: renameChat, isPending, error, data } = trpc.chat.renameChat.useMutation({
        onSuccess: () => {
            utils.chat.listChats.invalidate();
            // Could also invalidate specific chat if we had the ID in context
        }
    });
    return { renameChatAsync, renameChat, isPending, error, data };
}

export const useAddMessage = () => {
    const utils = trpc.useUtils();
    const { mutateAsync: addMessageAsync, mutate: addMessage, isPending, error, data } = trpc.chat.addMessage.useMutation({
        onSuccess: (_, variables) => {
            utils.chat.getChat.invalidate({ chatId: variables.chatId });
        }
    });
    return { addMessageAsync, addMessage, isPending, error, data };
}
