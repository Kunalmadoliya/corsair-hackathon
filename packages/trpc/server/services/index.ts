import UserService from "@repo/services/user";
import OpenAiChats from "@repo/services/openai/agents";

export const userService = new UserService();
export const openAiChats = new OpenAiChats();
