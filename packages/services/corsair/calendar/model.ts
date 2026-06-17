import { z } from "zod";

// Calendar
export const getAvailabilityInputType = z.object({
  timeMin: z.string(),
  timeMax: z.string(),
  timeZone: z.string().optional(),
  groupExpansionMax: z.number().optional(),
  calendarExpansionMax: z.number().optional(),
  items: z.array(z.object({ id: z.string() })).optional()
});
export const getAvailabilityOutputType = z.any();

// Events
export const createEventInputType = z.object({
  calendarId: z.string().optional(),
  event: z.any(),
  sendUpdates: z.enum(['all', 'externalOnly', 'none']).optional(),
  sendNotifications: z.boolean().optional(),
  conferenceDataVersion: z.number().optional(),
  maxAttendees: z.number().optional(),
  supportsAttachments: z.boolean().optional()
});
export const createEventOutputType = z.any();

export const deleteEventInputType = z.object({
  calendarId: z.string().optional(),
  id: z.string(),
  sendUpdates: z.enum(['all', 'externalOnly', 'none']).optional(),
  sendNotifications: z.boolean().optional()
});
export const deleteEventOutputType = z.void();

export const getEventInputType = z.object({
  calendarId: z.string().optional(),
  id: z.string(),
  timeZone: z.string().optional(),
  maxAttendees: z.number().optional()
});
export const getEventOutputType = z.any();

export const getManyEventsInputType = z.object({
  calendarId: z.string().optional(),
  timeMin: z.string().optional(),
  timeMax: z.string().optional(),
  timeZone: z.string().optional(),
  updatedMin: z.string().optional(),
  singleEvents: z.boolean().optional(),
  maxResults: z.number().optional(),
  pageToken: z.string().optional(),
  q: z.string().optional(),
  orderBy: z.enum(['startTime', 'updated']).optional(),
  iCalUID: z.string().optional(),
  showDeleted: z.boolean().optional(),
  showHiddenInvitations: z.boolean().optional()
});
export const getManyEventsOutputType = z.any();

export const updateEventInputType = z.object({
  calendarId: z.string().optional(),
  id: z.string(),
  event: z.any(),
  sendUpdates: z.enum(['all', 'externalOnly', 'none']).optional(),
  sendNotifications: z.boolean().optional(),
  conferenceDataVersion: z.number().optional(),
  maxAttendees: z.number().optional(),
  supportsAttachments: z.boolean().optional()
});
export const updateEventOutputType = z.any();

// Authentication
export const connectCalendarInputType = z.object({});
export const connectCalendarOutputType = z.object({
  url: z.string()
});

export const calendarCallbackInputType = z.object({
  code: z.string(),
  state: z.string()
});
export const calendarCallbackOutputType = z.object({
  url: z.string()
});
