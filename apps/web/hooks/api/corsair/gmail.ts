import { trpc } from "~/trpc/client";

export const useConnectGmail = () => {
    const utils = trpc.useUtils();
    const { mutateAsync: connectGmailAsync, mutate: connectGmail, isPending, error } = trpc.corsairGmail.connectGmail.useMutation({
        onSuccess: () => {
            utils.auth.getUserWithToken.invalidate();
        }
    });

    return { connectGmailAsync, connectGmail, isPending, error };
}

export const useGmailCallback = () => {
    const { mutateAsync: gmailCallbackAsync, mutate: gmailCallback, isPending, error } = trpc.corsairGmail.gmailCallback.useMutation();
    return { gmailCallbackAsync, gmailCallback, isPending, error };
}

// Drafts
export const useCreateDraft = () => {
    const { mutateAsync: createDraftAsync, mutate: createDraft, isPending, error } = trpc.corsairGmail.createDraft.useMutation();
    return { createDraftAsync, createDraft, isPending, error };
}

export const useDeleteDraft = () => {
    const { mutateAsync: deleteDraftAsync, mutate: deleteDraft, isPending, error } = trpc.corsairGmail.deleteDraft.useMutation();
    return { deleteDraftAsync, deleteDraft, isPending, error };
}

export const useGetDraft = () => {
    const { mutateAsync: getDraftAsync, mutate: getDraft, isPending, error } = trpc.corsairGmail.getDraft.useMutation();
    return { getDraftAsync, getDraft, isPending, error };
}

export const useListDrafts = () => {
    const { mutateAsync: listDraftsAsync, mutate: listDrafts, isPending, error } = trpc.corsairGmail.listDrafts.useMutation();
    return { listDraftsAsync, listDrafts, isPending, error };
}

export const useSendDraft = () => {
    const { mutateAsync: sendDraftAsync, mutate: sendDraft, isPending, error } = trpc.corsairGmail.sendDraft.useMutation();
    return { sendDraftAsync, sendDraft, isPending, error };
}

export const useUpdateDraft = () => {
    const { mutateAsync: updateDraftAsync, mutate: updateDraft, isPending, error } = trpc.corsairGmail.updateDraft.useMutation();
    return { updateDraftAsync, updateDraft, isPending, error };
}

// Labels
export const useCreateLabel = () => {
    const { mutateAsync: createLabelAsync, mutate: createLabel, isPending, error } = trpc.corsairGmail.createLabel.useMutation();
    return { createLabelAsync, createLabel, isPending, error };
}

export const useDeleteLabel = () => {
    const { mutateAsync: deleteLabelAsync, mutate: deleteLabel, isPending, error } = trpc.corsairGmail.deleteLabel.useMutation();
    return { deleteLabelAsync, deleteLabel, isPending, error };
}

export const useGetLabel = () => {
    const { mutateAsync: getLabelAsync, mutate: getLabel, isPending, error } = trpc.corsairGmail.getLabel.useMutation();
    return { getLabelAsync, getLabel, isPending, error };
}

export const useListLabels = () => {
    const { mutateAsync: listLabelsAsync, mutate: listLabels, isPending, error } = trpc.corsairGmail.listLabels.useMutation();
    return { listLabelsAsync, listLabels, isPending, error };
}

export const useUpdateLabel = () => {
    const { mutateAsync: updateLabelAsync, mutate: updateLabel, isPending, error } = trpc.corsairGmail.updateLabel.useMutation();
    return { updateLabelAsync, updateLabel, isPending, error };
}

// Messages
export const useBatchModifyMessages = () => {
    const { mutateAsync: batchModifyMessagesAsync, mutate: batchModifyMessages, isPending, error } = trpc.corsairGmail.batchModifyMessages.useMutation();
    return { batchModifyMessagesAsync, batchModifyMessages, isPending, error };
}

export const useDeleteMessage = () => {
    const { mutateAsync: deleteMessageAsync, mutate: deleteMessage, isPending, error } = trpc.corsairGmail.deleteMessage.useMutation();
    return { deleteMessageAsync, deleteMessage, isPending, error };
}

export const useGetMessage = () => {
    const { mutateAsync: getMessageAsync, mutate: getMessage, isPending, error } = trpc.corsairGmail.getMessage.useMutation();
    return { getMessageAsync, getMessage, isPending, error };
}

export const useListMessages = () => {
    const { mutateAsync: listMessagesAsync, mutate: listMessages, isPending, error } = trpc.corsairGmail.listMessages.useMutation();
    return { listMessagesAsync, listMessages, isPending, error };
}

export const useModifyMessage = () => {
    const { mutateAsync: modifyMessageAsync, mutate: modifyMessage, isPending, error } = trpc.corsairGmail.modifyMessage.useMutation();
    return { modifyMessageAsync, modifyMessage, isPending, error };
}

export const useSendMessage = () => {
    const { mutateAsync: sendMessageAsync, mutate: sendMessage, isPending, error } = trpc.corsairGmail.sendMessage.useMutation();
    return { sendMessageAsync, sendMessage, isPending, error };
}

export const useTrashMessage = () => {
    const { mutateAsync: trashMessageAsync, mutate: trashMessage, isPending, error } = trpc.corsairGmail.trashMessage.useMutation();
    return { trashMessageAsync, trashMessage, isPending, error };
}

export const useUntrashMessage = () => {
    const { mutateAsync: untrashMessageAsync, mutate: untrashMessage, isPending, error } = trpc.corsairGmail.untrashMessage.useMutation();
    return { untrashMessageAsync, untrashMessage, isPending, error };
}

// Threads
export const useDeleteThread = () => {
    const { mutateAsync: deleteThreadAsync, mutate: deleteThread, isPending, error } = trpc.corsairGmail.deleteThread.useMutation();
    return { deleteThreadAsync, deleteThread, isPending, error };
}

export const useGetThread = () => {
    const { mutateAsync: getThreadAsync, mutate: getThread, isPending, error } = trpc.corsairGmail.getThread.useMutation();
    return { getThreadAsync, getThread, isPending, error };
}

export const useListThreads = () => {
    const { mutateAsync: listThreadsAsync, mutate: listThreads, isPending, error } = trpc.corsairGmail.listThreads.useMutation();
    return { listThreadsAsync, listThreads, isPending, error };
}

export const useModifyThread = () => {
    const { mutateAsync: modifyThreadAsync, mutate: modifyThread, isPending, error } = trpc.corsairGmail.modifyThread.useMutation();
    return { modifyThreadAsync, modifyThread, isPending, error };
}

export const useTrashThread = () => {
    const { mutateAsync: trashThreadAsync, mutate: trashThread, isPending, error } = trpc.corsairGmail.trashThread.useMutation();
    return { trashThreadAsync, trashThread, isPending, error };
}

export const useUntrashThread = () => {
    const { mutateAsync: untrashThreadAsync, mutate: untrashThread, isPending, error } = trpc.corsairGmail.untrashThread.useMutation();
    return { untrashThreadAsync, untrashThread, isPending, error };
}

export const useGetInbox = () => {
    const { mutateAsync: getInboxAsync, mutate: getInbox, isPending, error } = trpc.corsairGmail.getInbox.useMutation();
    return { getInboxAsync, getInbox, isPending, error };
}
