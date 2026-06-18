import { db, eq } from "@repo/database";
import { usersTable } from "@repo/database/schema";

import { env } from "../../env";
import { generateOAuthUrl, processOAuthCallback } from "corsair/oauth";
import { exchangeCodeForTokens, createAccountKeyManager, initializeAccountDEK } from "corsair/core";
import { corsair } from "../../corsair";

import { corsairAccounts } from "@repo/database/schema";

import { setupCorsair } from "corsair";

// Google Calendar OAuth scope to append to the Gmail flow
const CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar";

class CorsairGmailServices {

    private async ensureConnected(tenantId: string) {
        const user = await db.select().from(usersTable).where(eq(usersTable.id, tenantId)).limit(1);
        if (!user[0] || !user[0].isGmailConnected) {
            throw new Error("Gmail is not connected for this user");
        }
    }

    public async connectGmail(id: string) {
        await setupCorsair(corsair, { tenantId: id });
        const { url } = await generateOAuthUrl(
            corsair,
            "gmail",
            {
                tenantId: id,
                redirectUri: env.WEB_URL + "/api/corsair/callback"
            }
        );
        return { url };
    }

    public async gmailCallback(code: string, state: string) {
        const gmailResult = await processOAuthCallback(corsair, {
            code,
            state,
            redirectUri: env.WEB_URL + "/api/corsair/callback"
        });

        if (!gmailResult) {
            throw new Error("Gmail OAuth callback failed");
        }

        const tenantId = gmailResult.tenantId;

        await db
            .update(usersTable)
            .set({ isGmailConnected: true })
            .where(eq(usersTable.id, tenantId));

        return gmailResult;
    }

    // --- Drafts ---
    public async createDraft(tenantId: string, payload: any) {
        await this.ensureConnected(tenantId);
        return await corsair.withTenant(tenantId).gmail.api.drafts.create({ userId: 'me', ...payload });
    }

    public async deleteDraft(tenantId: string, payload: any) {
        await this.ensureConnected(tenantId);
        return await corsair.withTenant(tenantId).gmail.api.drafts.delete({ userId: 'me', ...payload });
    }

    public async getDraft(tenantId: string, payload: any) {
        await this.ensureConnected(tenantId);
        return await corsair.withTenant(tenantId).gmail.api.drafts.get({ userId: 'me', ...payload });
    }

    public async listDrafts(tenantId: string, payload: any) {
        await this.ensureConnected(tenantId);
        return await corsair.withTenant(tenantId).gmail.api.drafts.list({ userId: 'me', ...payload });
    }

    public async sendDraft(tenantId: string, payload: any) {
        await this.ensureConnected(tenantId);
        return await corsair.withTenant(tenantId).gmail.api.drafts.send({ userId: 'me', ...payload });
    }

    public async updateDraft(tenantId: string, payload: any) {
        await this.ensureConnected(tenantId);
        return await corsair.withTenant(tenantId).gmail.api.drafts.update({ userId: 'me', ...payload });
    }

    // --- Labels ---
    public async createLabel(tenantId: string, payload: any) {
        await this.ensureConnected(tenantId);
        return await corsair.withTenant(tenantId).gmail.api.labels.create({ userId: 'me', ...payload });
    }

    public async deleteLabel(tenantId: string, payload: any) {
        await this.ensureConnected(tenantId);
        return await corsair.withTenant(tenantId).gmail.api.labels.delete({ userId: 'me', ...payload });
    }

    public async getLabel(tenantId: string, payload: any) {
        await this.ensureConnected(tenantId);
        return await corsair.withTenant(tenantId).gmail.api.labels.get({ userId: 'me', ...payload });
    }

    public async listLabels(tenantId: string, payload: any) {
        await this.ensureConnected(tenantId);
        return await corsair.withTenant(tenantId).gmail.api.labels.list({ userId: 'me', ...payload });
    }

    public async updateLabel(tenantId: string, payload: any) {
        await this.ensureConnected(tenantId);
        return await corsair.withTenant(tenantId).gmail.api.labels.update({ userId: 'me', ...payload });
    }

    // --- Messages ---
    public async batchModifyMessages(tenantId: string, payload: any) {
        await this.ensureConnected(tenantId);
        return await corsair.withTenant(tenantId).gmail.api.messages.batchModify({ userId: 'me', ...payload });
    }

    public async deleteMessage(tenantId: string, payload: any) {
        await this.ensureConnected(tenantId);
        return await corsair.withTenant(tenantId).gmail.api.messages.delete({ userId: 'me', ...payload });
    }

    public async getMessage(tenantId: string, payload: any) {
        await this.ensureConnected(tenantId);
        return await corsair.withTenant(tenantId).gmail.api.messages.get({ userId: 'me', ...payload });
    }

    public async listMessages(tenantId: string, payload: any) {
        await this.ensureConnected(tenantId);
        return await corsair.withTenant(tenantId).gmail.api.messages.list({ userId: 'me', ...payload });
    }

    public async modifyMessage(tenantId: string, payload: any) {
        await this.ensureConnected(tenantId);
        return await corsair.withTenant(tenantId).gmail.api.messages.modify({ userId: 'me', ...payload });
    }

    public async sendMessage(tenantId: string, payload: any) {
        await this.ensureConnected(tenantId);
        return await corsair.withTenant(tenantId).gmail.api.messages.send({ userId: 'me', ...payload });
    }

    public async trashMessage(tenantId: string, payload: any) {
        await this.ensureConnected(tenantId);
        return await corsair.withTenant(tenantId).gmail.api.messages.trash({ userId: 'me', ...payload });
    }

    public async untrashMessage(tenantId: string, payload: any) {
        await this.ensureConnected(tenantId);
        return await corsair.withTenant(tenantId).gmail.api.messages.untrash({ userId: 'me', ...payload });
    }

    // --- Threads ---
    public async deleteThread(tenantId: string, payload: any) {
        await this.ensureConnected(tenantId);
        return await corsair.withTenant(tenantId).gmail.api.threads.delete({ userId: 'me', ...payload });
    }

    public async getThread(tenantId: string, payload: any) {
        await this.ensureConnected(tenantId);
        return await corsair.withTenant(tenantId).gmail.api.threads.get({ userId: 'me', ...payload });
    }

    public async listThreads(tenantId: string, payload: any) {
        await this.ensureConnected(tenantId);
        return await corsair.withTenant(tenantId).gmail.api.threads.list({ userId: 'me', ...payload });
    }

    public async modifyThread(tenantId: string, payload: any) {
        await this.ensureConnected(tenantId);
        return await corsair.withTenant(tenantId).gmail.api.threads.modify({ userId: 'me', ...payload });
    }

    public async trashThread(tenantId: string, payload: any) {
        await this.ensureConnected(tenantId);
        return await corsair.withTenant(tenantId).gmail.api.threads.trash({ userId: 'me', ...payload });
    }

    public async untrashThread(tenantId: string, payload: any) {
        await this.ensureConnected(tenantId);
        return await corsair.withTenant(tenantId).gmail.api.threads.untrash({ userId: 'me', ...payload });
    }
}

export const corsairGmailService = new CorsairGmailServices();
export default CorsairGmailServices;