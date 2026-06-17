import { z } from "zod";
import { authenticatedProcedure, router } from "../../trpc";
import { db } from "@repo/database";
import { syncedEmailsTable, syncedEventsTable } from "@repo/database/schema";
import { desc, eq } from "drizzle-orm";
import { corsairGmailService, corsairCalendarService } from "../../services";

export const syncRouter = router({
    getSyncedEmails: authenticatedProcedure
        .input(z.object({
            limit: z.number().optional().default(20)
        }))
        .query(async ({ ctx, input }) => {
            return await db.select()
                .from(syncedEmailsTable)
                .where(eq(syncedEmailsTable.userId, ctx.user.id))
                .orderBy(desc(syncedEmailsTable.time))
                .limit(input.limit);
        }),

    getSyncedEvents: authenticatedProcedure
        .input(z.object({
            limit: z.number().optional().default(50)
        }))
        .query(async ({ ctx, input }) => {
            return await db.select()
                .from(syncedEventsTable)
                .where(eq(syncedEventsTable.userId, ctx.user.id))
                .orderBy(desc(syncedEventsTable.startTime))
                .limit(input.limit);
        }),

    syncHistoricalData: authenticatedProcedure
        .mutation(async ({ ctx }) => {
            let emailsSynced = 0;
            let eventsSynced = 0;
            
            try {
                // Fetch recent emails
                const res = await corsairGmailService.listMessages(ctx.user.id, {
                    maxResults: 20
                });
                
                if (res?.messages) {
                    for (const msgRef of res.messages) {
                        const msg = await corsairGmailService.getMessage(ctx.user.id, {
                            id: msgRef.id!
                        });
                        
                        if (msg) {
                            const subject = msg.payload?.headers?.find((h: any) => h.name?.toLowerCase() === 'subject')?.value || 'No Subject';
                            const sender = msg.payload?.headers?.find((h: any) => h.name?.toLowerCase() === 'from')?.value || 'Unknown';
                            
                            await db.insert(syncedEmailsTable).values({
                                id: msg.id!,
                                userId: ctx.user.id,
                                threadId: msg.threadId || '',
                                subject,
                                sender,
                                preview: msg.snippet || '',
                                time: new Date(Number(msg.internalDate) || Date.now()),
                                isRead: msg.labelIds?.includes('UNREAD') ? 'false' : 'true'
                            }).onConflictDoNothing();
                            emailsSynced++;
                        }
                    }
                }
            } catch (e) {
                console.error("[sync] Error syncing emails", e);
            }
            
            try {
                // Fetch recent events
                const now = new Date();
                const past = new Date();
                past.setDate(past.getDate() - 30); // Last 30 days
                const future = new Date();
                future.setDate(future.getDate() + 30); // Next 30 days
                
                const events = await corsairCalendarService.getManyEvents(ctx.user.id, {
                    timeMin: past.toISOString(),
                    timeMax: future.toISOString(),
                    maxResults: 50
                });
                
                if (events?.items) {
                    for (const event of events.items) {
                        if (event.id) {
                            const startTime = new Date(event.start?.dateTime || event.start?.date || Date.now());
                            const endTime = new Date(event.end?.dateTime || event.end?.date || Date.now());
                            
                            await db.insert(syncedEventsTable).values({
                                id: event.id,
                                userId: ctx.user.id,
                                title: event.summary || 'No Title',
                                startTime,
                                endTime,
                                attendees: event.attendees || []
                            }).onConflictDoNothing();
                            eventsSynced++;
                        }
                    }
                }
            } catch (e) {
                console.error("[sync] Error syncing events", e);
            }
            
            return { emailsSynced, eventsSynced };
        })
});
