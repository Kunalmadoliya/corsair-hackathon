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
        return await corsair.withTenant(tenantId).googlecalendar.api.events.create(payload);
    }

    public async deleteEvent(tenantId: string, payload: any) {
        await this.ensureConnected(tenantId);
        return await corsair.withTenant(tenantId).googlecalendar.api.events.delete(payload);
    }

    public async getEvent(tenantId: string, payload: any) {
        await this.ensureConnected(tenantId);
        return await corsair.withTenant(tenantId).googlecalendar.api.events.get(payload);
    }

    public async getManyEvents(tenantId: string, payload: any) {
        await this.ensureConnected(tenantId);
        return await corsair.withTenant(tenantId).googlecalendar.api.events.getMany(payload);
    }

    public async updateEvent(tenantId: string, payload: any) {
        await this.ensureConnected(tenantId);
        return await corsair.withTenant(tenantId).googlecalendar.api.events.update(payload);
    }
}

export const corsairCalendarService = new CorsairCalendarService();
export default CorsairCalendarService;
