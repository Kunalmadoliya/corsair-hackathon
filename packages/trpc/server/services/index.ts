import UserService from "@repo/services/user";
import OpenAiChats from "@repo/services/openai/agents";
import CorsairGmailService from "@repo/services/corsair/gmail";

export const userService = new UserService();
export const openAiChats = new OpenAiChats();
export const corsairGmailService = new CorsairGmailService();