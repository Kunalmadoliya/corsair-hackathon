import { db, eq } from "@repo/database";

import { env } from "../env";
import { generateOAuthUrl } from "corsair/oauth";
import { corsair } from "../corsair";

import { corsairAccounts, corsairEntities, corsairEvents, corsairIntegrations } from "@repo/database/schema";

import { GetAuthenticationMethodOutputSchemaType } from "./model"
import { googleOAuth2Client } from "../clients/google-oauth";
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


    public async gmailCallback(){}




}


export default CorsairGmailServices