import UserService from "@repo/services/user";
import OpenAiChats from "@repo/services/openai/agents";
import CorsairGmailService from "@repo/services/corsair/gmail";
import CorsairCalendarService from "@repo/services/corsair/calendar";
import ChatService from "@repo/services/chat";
import MemoryService from "@repo/services/memory";

export const userService = new UserService();
export const openAiChats = new OpenAiChats();
export const corsairGmailService = new CorsairGmailService();
export const corsairCalendarService = new CorsairCalendarService();
export const chatService = new ChatService();
export const memoryService = new MemoryService();