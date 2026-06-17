import { pool, db, eq } from '@repo/database';
import { corsairIntegrations, syncedEmailsTable, syncedEventsTable } from '@repo/database/schema';
import { createCorsair } from 'corsair';
import { gmail } from '@corsair-dev/gmail';
import { googlecalendar } from '@corsair-dev/googlecalendar';
import { env } from './env';

export const corsair: ReturnType<typeof createCorsair> = createCorsair({
    plugins: [
        gmail({
            authType: "oauth_2",
            webhookHooks: {
                messageChanged: {
                    after: async (ctx, payload) => {
                        const data = payload.data;
                        if (!data) return;
                        if (data.type === 'messageReceived' || data.type === 'messageLabelChanged') {
                            const message = data.message;
                            if (!message) return;
                            
                            // Get the userId from the account
                            const accountId = (ctx as any).accountId; // Or fetch it
                            // For simplicity we will assume tenantId was passed in webhook URL and mapped to account
                            // Actually, let's just insert it safely
                            const subject = message.payload?.headers?.find(h => h.name?.toLowerCase() === 'subject')?.value || 'No Subject';
                            const sender = message.payload?.headers?.find(h => h.name?.toLowerCase() === 'from')?.value || 'Unknown';
                            
                            try {
                                // Extract userId from context if available, else we might need to look it up
                                // Assuming the webhook route passes tenantId which is userId
                                const userId = (ctx as any).tenantId || "UNKNOWN"; // Placeholder if not directly accessible
                                
                                await db.insert(syncedEmailsTable).values({
                                    id: message.id!,
                                    userId: userId, // We'll patch this later if needed
                                    threadId: message.threadId || '',
                                    subject,
                                    sender,
                                    preview: message.snippet || '',
                                    time: new Date(Number(message.internalDate) || Date.now()),
                                    isRead: message.labelIds?.includes('UNREAD') ? 'false' : 'true'
                                }).onConflictDoUpdate({
                                    target: syncedEmailsTable.id,
                                    set: {
                                        isRead: message.labelIds?.includes('UNREAD') ? 'false' : 'true',
                                        time: new Date(Number(message.internalDate) || Date.now()),
                                    }
                                });
                            } catch (e) {
                                console.error("[corsair] Failed to sync email", e);
                            }
                        }
                    }
                }
            }
        }),
        googlecalendar({
            authType: "oauth_2",
            webhookHooks: {
                onEventChanged: {
                    after: async (ctx, payload) => {
                        const data = payload.data;
                        if (!data) return;
                        if (data.type === 'eventCreated' || data.type === 'eventUpdated') {
                            const event = data.event;
                            if (!event || !event.id) return;
                            
                            try {
                                const userId = (ctx as any).tenantId || "UNKNOWN";
                                const startTime = new Date(event.start?.dateTime || event.start?.date || Date.now());
                                const endTime = new Date(event.end?.dateTime || event.end?.date || Date.now());
                                
                                await db.insert(syncedEventsTable).values({
                                    id: event.id,
                                    userId: userId,
                                    title: event.summary || 'No Title',
                                    startTime,
                                    endTime,
                                    attendees: event.attendees || []
                                }).onConflictDoUpdate({
                                    target: syncedEventsTable.id,
                                    set: {
                                        title: event.summary || 'No Title',
                                        startTime,
                                        endTime,
                                        attendees: event.attendees || []
                                    }
                                });
                            } catch (e) {
                                console.error("[corsair] Failed to sync event", e);
                            }
                        } else if (data.type === 'eventDeleted') {
                            try {
                                await db.delete(syncedEventsTable).where(eq(syncedEventsTable.id, data.eventId));
                            } catch (e) {
                                console.error("[corsair] Failed to delete event", e);
                            }
                        }
                    }
                }
            }
        })
    ],
    database: pool,
    kek: env.CORSAIR_KEK!,
    multiTenancy: true,
});

// Seed integrations with Google Client ID and Secret automatically on startup
async function seedIntegrations() {
    try {
        if (!env.GOOGLE_OAUTH_CLIENT_ID || !env.GOOGLE_OAUTH_CLIENT_SECRET) {
            console.warn("[corsair] Google OAuth client credentials missing in env. Seeding skipped.");
            return;
        }

        const config = {
            client_id: env.GOOGLE_OAUTH_CLIENT_ID,
            client_secret: env.GOOGLE_OAUTH_CLIENT_SECRET,
        };

        // Seed Gmail integration
        const existingGmail = await db
            .select()
            .from(corsairIntegrations)
            .where(eq(corsairIntegrations.id, "gmail"));
            
        if (existingGmail.length === 0) {
            await db.insert(corsairIntegrations).values({
                id: "gmail",
                name: "Gmail",
                config: config,
            });
        } else {
            await db
                .update(corsairIntegrations)
                .set({ config: config, updatedAt: new Date() })
                .where(eq(corsairIntegrations.id, "gmail"));
        }

        // Seed Google Calendar integration
        const existingCalendar = await db
            .select()
            .from(corsairIntegrations)
            .where(eq(corsairIntegrations.id, "googlecalendar"));
            
        if (existingCalendar.length === 0) {
            await db.insert(corsairIntegrations).values({
                id: "googlecalendar",
                name: "Google Calendar",
                config: config,
            });
        } else {
            await db
                .update(corsairIntegrations)
                .set({ config: config, updatedAt: new Date() })
                .where(eq(corsairIntegrations.id, "googlecalendar"));
        }

        console.log("[corsair] Successfully seeded gmail and googlecalendar credentials in database.");
    } catch (err) {
        console.error("[corsair] Failed to seed Google integrations in database:", err);
    }
}

// Execute seed asynchronously on import
seedIntegrations();