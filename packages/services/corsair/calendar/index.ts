import { db, eq } from "@repo/database";
import { usersTable } from "@repo/database/schema";
import { corsair } from "../../corsair";
import { env } from "../../env";
import { generateOAuthUrl, processOAuthCallback } from "corsair/oauth";
import { setupCorsair } from "corsair";
import { createAccountKeyManager } from "corsair/core";

class CorsairCalendarService {
    private async ensureConnected(tenantId: string) {
        const user = await db.select().from(usersTable).where(eq(usersTable.id, tenantId)).limit(1);
        if (!user[0] || !user[0].isCalendarConnected) {
            throw new Error("Calendar is not connected for this user");
        }
    }

    public async connectCalendar(id: string) {
        await setupCorsair(corsair, { tenantId: id });
        const { url } = await generateOAuthUrl(
            corsair,
            "googlecalendar",
            {
                tenantId: id,
                redirectUri: env.WEB_URL + "/api/corsair/callback-calendar"
            }
        );
        return { url };
    }

    public async calendarCallback(code: string, state: string) {
        const calendarResult = await processOAuthCallback(corsair, {
            code,
            state,
            redirectUri: env.WEB_URL + "/api/corsair/callback-calendar"
        });

        if (!calendarResult) {
            throw new Error("Calendar OAuth callback failed");
        }

        const tenantId = calendarResult.tenantId;

        try {
            const internalCfg = (corsair as any)[
                Object.getOwnPropertySymbols(corsair).find(s => s.description === 'corsair_internal_config') as symbol
            ];
            const kek = internalCfg?.encryptionKey;
            const database = internalCfg?.database;

            if (kek && database) {
                const calendarKeyManager = createAccountKeyManager({
                    authType: "oauth_2",
                    integrationName: "googlecalendar",
                    tenantId,
                    kek,
                    database,
                });
                
                const accessToken = await calendarKeyManager.get_access_token();

                if (accessToken) {
                    await setupCorsair(corsair, { tenantId });
                }
            }
        } catch (err) {
            console.warn("[corsair] Calendar token fetch failed (non-fatal):", err);
        }

        await db
            .update(usersTable)
            .set({ isCalendarConnected: true })
            .where(eq(usersTable.id, tenantId));

        return calendarResult;
    }

    public async getAvailability(tenantId: string, payload: any) {
        await this.ensureConnected(tenantId);
        return await corsair.withTenant(tenantId).googlecalendar.api.calendar.getAvailability(payload);
    }

    public async createEvent(tenantId: string, payload: any) {
        await this.ensureConnected(tenantId);
        const hasAttendees = payload.attendees && payload.attendees.length > 0;
        return await corsair.withTenant(tenantId).googlecalendar.api.events.create({
            calendarId: payload.calendarId || 'primary',
            sendUpdates: hasAttendees ? 'all' : 'none',
            ...(payload.addMeetLink ? { conferenceDataVersion: 1 } : {}),
            event: payload.event ? payload.event : {
                summary: payload.title || payload.summary,
                ...(payload.description ? { description: payload.description } : {}),
                ...(payload.location ? { location: payload.location } : {}),
                start: payload.start?.dateTime ? payload.start : { dateTime: new Date(payload.start).toISOString() },
                end: payload.end?.dateTime ? payload.end : { dateTime: new Date(payload.end).toISOString() },
                ...(hasAttendees ? { attendees: payload.attendees.map((email: string) => typeof email === 'string' ? { email } : email) } : {}),
                ...(payload.colorId ? { colorId: payload.colorId } : {}),
                ...(payload.recurrence ? { recurrence: payload.recurrence } : {}),
                ...(payload.addMeetLink ? {
                    conferenceData: {
                        createRequest: {
                            requestId: Math.random().toString(36).substring(2, 15) + Date.now().toString(36),
                            conferenceSolutionKey: { type: 'hangoutsMeet' }
                        }
                    }
                } : {})
            }
        });
    }

    public async deleteEvent(tenantId: string, payload: any) {
        await this.ensureConnected(tenantId);
        return await corsair.withTenant(tenantId).googlecalendar.api.events.delete({
            calendarId: payload.calendarId || 'primary',
            sendUpdates: 'all',
            ...payload
        });
    }

    public async getEvent(tenantId: string, payload: any) {
        await this.ensureConnected(tenantId);
        return await corsair.withTenant(tenantId).googlecalendar.api.events.get({
            calendarId: payload.calendarId || 'primary',
            ...payload
        });
    }

    public async getManyEvents(tenantId: string, payload: any) {
        await this.ensureConnected(tenantId);
        const queryParamsBase = {
            singleEvents: true,
            orderBy: 'startTime' as const,
            maxResults: 250,
            timeMin: payload.timeMin || new Date().toISOString(),
            ...(payload.timeMax ? { timeMax: payload.timeMax } : {})
        };
        const data = await corsair.withTenant(tenantId).googlecalendar.api.events.getMany({
            calendarId: payload.calendarId || 'primary',
            ...queryParamsBase,
            ...payload
        });
        const rawEvents = data.items || [];
        return rawEvents.map((e: any) => ({
            id: e.id,
            title: e.summary || '(No Title)',
            start: e.start?.dateTime || e.start?.date || new Date().toISOString(),
            end: e.end?.dateTime || e.end?.date,
            description: e.description || '',
            location: e.location || '',
            status: e.status || 'confirmed',
            attendees: e.attendees || [],
            htmlLink: e.htmlLink || '',
            colorId: e.colorId || null,
            hangoutLink: e.hangoutLink || ''
        }));
    }

    public async updateEvent(tenantId: string, payload: any) {
        await this.ensureConnected(tenantId);
        const hasAttendees = payload.attendees && payload.attendees.length > 0;
        return await corsair.withTenant(tenantId).googlecalendar.api.events.update({
            calendarId: payload.calendarId || 'primary',
            id: payload.id || payload.eventId,
            sendUpdates: hasAttendees ? 'all' : 'none',
            ...(payload.addMeetLink ? { conferenceDataVersion: 1 } : {}),
            event: payload.event ? payload.event : {
                summary: payload.title || payload.summary,
                ...(payload.description ? { description: payload.description } : {}),
                ...(payload.location ? { location: payload.location } : {}),
                start: payload.start?.dateTime ? payload.start : { dateTime: new Date(payload.start).toISOString() },
                end: payload.end?.dateTime ? payload.end : { dateTime: new Date(payload.end).toISOString() },
                ...(hasAttendees ? { attendees: payload.attendees.map((email: string) => typeof email === 'string' ? { email } : email) } : {}),
                ...(payload.colorId ? { colorId: payload.colorId } : {}),
                ...(payload.recurrence ? { recurrence: payload.recurrence } : {}),
                ...(payload.addMeetLink ? {
                    conferenceData: {
                        createRequest: {
                            requestId: Math.random().toString(36).substring(2, 15) + Date.now().toString(36),
                            conferenceSolutionKey: { type: 'hangoutsMeet' }
                        }
                    }
                } : {})
            }
        });
    }
}

export const corsairCalendarService = new CorsairCalendarService();
export default CorsairCalendarService;
