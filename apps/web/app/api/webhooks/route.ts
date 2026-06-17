import { processWebhook } from "corsair";
import { corsair } from "@repo/services/corsair";

export async function POST(req: Request) {
    const url = new URL(req.url);

    const result = await processWebhook(
        corsair, // corsair instance
        Object.fromEntries(req.headers), // headers
        await req.json(), // body
        {
            tenantId: url.searchParams.get('tenantId') || undefined // tenant id
        }
    );

    if (result.plugin) {
        console.log(`[Webhook] Handled by ${result.plugin}.${result.action}`);
    }

    return new Response(JSON.stringify(result.response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
