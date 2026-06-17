import { db, eq, and } from "@repo/database";
import { userMemoryTable } from "@repo/database/schema";

class MemoryService {
    public async getMemory(userId: string) {
        const memory = await db.select().from(userMemoryTable)
            .where(eq(userMemoryTable.userId, userId));
        return { memory };
    }

    public async upsertMemory(userId: string, key: string, value: any) {
        const existing = await db.select().from(userMemoryTable)
            .where(and(eq(userMemoryTable.userId, userId), eq(userMemoryTable.key, key)))
            .limit(1);

        if (existing[0]) {
            const updated = await db.update(userMemoryTable)
                .set({ value, updatedAt: new Date() })
                .where(eq(userMemoryTable.id, existing[0].id))
                .returning();
            return { memory: updated[0] };
        } else {
            const inserted = await db.insert(userMemoryTable)
                .values({ userId, key, value })
                .returning();
            return { memory: inserted[0] };
        }
    }

    public async deleteMemory(userId: string, key: string) {
        const existing = await db.select().from(userMemoryTable)
            .where(and(eq(userMemoryTable.userId, userId), eq(userMemoryTable.key, key)))
            .limit(1);

        if (existing[0]) {
            await db.delete(userMemoryTable).where(eq(userMemoryTable.id, existing[0].id));
        }
        return { success: true };
    }

    public async getSummary(userId: string) {
        const memoryResult = await this.getMemory(userId);
        if (memoryResult.memory.length === 0) {
            return "No user memory context available.";
        }

        return memoryResult.memory.map(m => `- ${m.key}: ${JSON.stringify(m.value)}`).join('\n');
    }
}

export default MemoryService;
