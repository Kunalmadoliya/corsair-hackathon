import { db, eq } from "@repo/database";

import { env } from "../../env";
import { generateOAuthUrl, processOAuthCallback } from "corsair/oauth";
import { corsair } from "../../corsair";

import { corsairAccounts, corsairEntities, corsairEvents, corsairIntegrations } from "@repo/database/schema";

import { setupCorsair } from 'corsair';




class CorsairGmailServices {

    //    public async onUserCreated(userId: string){
    //         await setupCorsair(corsair, { tenantId: userId });
    //         const tenant = corsair.withTenant(userId);
    // await tenant.linear.keys.set_api_key(apiKey);
    // // account row must exist — setupCorsair creates it
    //    }

    private async isUserAlreadyExisted(id: string) {
        const data = await db.select().from(corsairAccounts).where(eq(corsairAccounts.tenantId, id))

        if (data.length > 1) {
            throw new Error("Something went wrong!")
        }

        return data[0] ?? null
    }

    public async connectGmail(id: string) {

        const checkUser = await this.isUserAlreadyExisted(id)

        if (checkUser) {
            throw new Error("User already connected with Corsair")
        }

        await setupCorsair(corsair, {
            tenantId: id,
        });


        const { url } = await generateOAuthUrl(
            corsair,
            "gmail",
            {
                tenantId: id,
                redirectUri: env.BASE_URL + '/api/corsair/callback'
            }
        )

        return { url }
    }


    public async gmailCallback(code: string, state: string) {
        const result = await processOAuthCallback(corsair, { code, state, redirectUri: env.BASE_URL + '/api/corsair/callback' })

        if (!result) {
            throw new Error("")
        }

        return result
    }

    public async readGmail(tenantId: string) {
        const tenant = corsair.withTenant(tenantId)

        const readInboxes = tenant.gmail.api.messages.list({
            maxResults: 10,
            includeSpamTrash: false
        })

        return { readInboxes }
    }


}


export default CorsairGmailServices