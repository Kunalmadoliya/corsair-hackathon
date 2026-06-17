import { db, eq, desc } from "@repo/database";
import { chatsTable, chatMessagesTable } from "@repo/database/schema";

class ChatService {
    public async createChat(userId: string, title: string = "New Chat") {
        const chat = await db.insert(chatsTable).values({
            userId,
            title
        }).returning();
        return { chat: chat[0] };
    }

    public async listChats(userId: string) {
        const chats = await db.select().from(chatsTable)
            .where(eq(chatsTable.userId, userId))
            .orderBy(desc(chatsTable.updatedAt));
        return { chats };
    }

    public async getChat(userId: string, chatId: string) {
        const chatResult = await db.select().from(chatsTable)
            .where(eq(chatsTable.id, chatId))
            .limit(1);

        if (!chatResult[0] || chatResult[0].userId !== userId) {
            throw new Error("Chat not found");
        }

        const messages = await db.select().from(chatMessagesTable)
            .where(eq(chatMessagesTable.chatId, chatId))
            .orderBy(chatMessagesTable.createdAt);

        return { chat: chatResult[0], messages };
    }

    public async deleteChat(userId: string, chatId: string) {
        // First ensure it belongs to the user
        const chatResult = await db.select().from(chatsTable)
            .where(eq(chatsTable.id, chatId))
            .limit(1);

        if (!chatResult[0] || chatResult[0].userId !== userId) {
            throw new Error("Chat not found");
        }

        await db.delete(chatsTable).where(eq(chatsTable.id, chatId));
        return { success: true };
    }

    public async renameChat(userId: string, chatId: string, title: string) {
        const chatResult = await db.select().from(chatsTable)
            .where(eq(chatsTable.id, chatId))
            .limit(1);

        if (!chatResult[0] || chatResult[0].userId !== userId) {
            throw new Error("Chat not found");
        }

        const updated = await db.update(chatsTable)
            .set({ title })
            .where(eq(chatsTable.id, chatId))
            .returning();

        return { chat: updated[0] };
    }

    public async addMessage(chatId: string, role: string, content: string) {
        const message = await db.insert(chatMessagesTable).values({
            chatId,
            role,
            content
        }).returning();
        
        // Update chat's updatedAt
        await db.update(chatsTable)
            .set({ updatedAt: new Date() })
            .where(eq(chatsTable.id, chatId));

        return { message: message[0] };
    }
}

export default ChatService;
