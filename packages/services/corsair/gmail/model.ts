import { z } from "zod";

// Drafts
export const createDraftInputType = z.object({
  userId: z.string().optional(),
  draft: z.object({
    message: z.object({
      raw: z.string().optional(),
      threadId: z.string().optional()
    }).optional()
  }).optional()
});
export const createDraftOutputType = z.any();

export const deleteDraftInputType = z.object({
  userId: z.string().optional(),
  id: z.string()
});
export const deleteDraftOutputType = z.void();

export const getDraftInputType = z.object({
  userId: z.string().optional(),
  id: z.string(),
  format: z.enum(['minimal', 'full', 'raw', 'metadata']).optional()
});
export const getDraftOutputType = z.any();

export const listDraftsInputType = z.object({
  userId: z.string().optional(),
  maxResults: z.number().optional(),
  pageToken: z.string().optional(),
  q: z.string().optional()
});
export const listDraftsOutputType = z.any();

export const sendDraftInputType = z.object({
  userId: z.string().optional(),
  id: z.string().optional(),
  message: z.object({
    raw: z.string().optional(),
    threadId: z.string().optional()
  }).optional()
});
export const sendDraftOutputType = z.any();

export const updateDraftInputType = z.object({
  userId: z.string().optional(),
  id: z.string(),
  draft: z.any().optional()
});
export const updateDraftOutputType = z.any();

// Labels
export const createLabelInputType = z.object({
  userId: z.string().optional(),
  label: z.any()
});
export const createLabelOutputType = z.any();

export const deleteLabelInputType = z.object({
  userId: z.string().optional(),
  id: z.string()
});
export const deleteLabelOutputType = z.void();

export const getLabelInputType = z.object({
  userId: z.string().optional(),
  id: z.string()
});
export const getLabelOutputType = z.any();

export const listLabelsInputType = z.object({
  userId: z.string().optional()
});
export const listLabelsOutputType = z.any();

export const updateLabelInputType = z.object({
  userId: z.string().optional(),
  id: z.string(),
  label: z.any()
});
export const updateLabelOutputType = z.any();

// Messages
export const batchModifyMessagesInputType = z.object({
  userId: z.string().optional(),
  ids: z.array(z.string()).optional(),
  addLabelIds: z.array(z.string()).optional(),
  removeLabelIds: z.array(z.string()).optional()
});
export const batchModifyMessagesOutputType = z.void();

export const deleteMessageInputType = z.object({
  userId: z.string().optional(),
  id: z.string()
});
export const deleteMessageOutputType = z.void();

export const getMessageInputType = z.object({
  userId: z.string().optional(),
  id: z.string(),
  format: z.enum(['minimal', 'full', 'raw', 'metadata']).optional(),
  metadataHeaders: z.array(z.string()).optional()
});
export const getMessageOutputType = z.any();

export const listMessagesInputType = z.object({
  userId: z.string().optional(),
  q: z.string().optional(),
  maxResults: z.number().optional(),
  pageToken: z.string().optional(),
  labelIds: z.array(z.string()).optional(),
  includeSpamTrash: z.boolean().optional()
});
export const listMessagesOutputType = z.any();

export const modifyMessageInputType = z.object({
  userId: z.string().optional(),
  id: z.string(),
  addLabelIds: z.array(z.string()).optional(),
  removeLabelIds: z.array(z.string()).optional()
});
export const modifyMessageOutputType = z.any();

export const sendMessageInputType = z.object({
  userId: z.string().optional(),
  raw: z.string(),
  threadId: z.string().optional()
});
export const sendMessageOutputType = z.any();

export const trashMessageInputType = z.object({
  userId: z.string().optional(),
  id: z.string()
});
export const trashMessageOutputType = z.any();

export const untrashMessageInputType = z.object({
  userId: z.string().optional(),
  id: z.string()
});
export const untrashMessageOutputType = z.any();

// Threads
export const deleteThreadInputType = z.object({
  userId: z.string().optional(),
  id: z.string()
});
export const deleteThreadOutputType = z.void();

export const getThreadInputType = z.object({
  userId: z.string().optional(),
  id: z.string(),
  format: z.enum(['minimal', 'full', 'metadata']).optional(),
  metadataHeaders: z.array(z.string()).optional()
});
export const getThreadOutputType = z.any();

export const listThreadsInputType = z.object({
  userId: z.string().optional(),
  q: z.string().optional(),
  maxResults: z.number().optional(),
  pageToken: z.string().optional(),
  labelIds: z.array(z.string()).optional(),
  includeSpamTrash: z.boolean().optional()
});
export const listThreadsOutputType = z.any();

export const modifyThreadInputType = z.object({
  userId: z.string().optional(),
  id: z.string(),
  addLabelIds: z.array(z.string()).optional(),
  removeLabelIds: z.array(z.string()).optional()
});
export const modifyThreadOutputType = z.any();

export const trashThreadInputType = z.object({
  userId: z.string().optional(),
  id: z.string()
});
export const trashThreadOutputType = z.any();

export const untrashThreadInputType = z.object({
  userId: z.string().optional(),
  id: z.string()
});
export const untrashThreadOutputType = z.any();
