import { corsairCalendarService } from "./packages/services/corsair/calendar/index.ts";
import { db } from "./packages/database";
import { usersTable } from "./packages/database/schema";

async function run() {
    const allUsers = await db.select().from(usersTable);
    if (allUsers.length === 0) return;
    const userId = allUsers[0].id;
    
    try {
        const res = await corsairCalendarService.getManyEvents(userId, { maxResults: 5 });
        console.log("calendar result:", JSON.stringify(res, null, 2));
    } catch (e) {
        console.error("Error calling calendar:", e);
    }
}
run().catch(console.error);
