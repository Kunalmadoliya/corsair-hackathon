import { z, zodUndefinedModel } from "../../schema";
import { openAiChats} from "../../services";
import { publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";

import { openaiagentInputModel, openaiagentOutputModel } from "./model";

const TAGS = ["Agents"];
const getPath = generatePath("/corsair-agents");

export const openaiagentsRouter = router({
    openaiagent: publicProcedure.meta({
        openapi: { method: "POST", path: getPath("/agent"), tags: TAGS }
    }).input(openaiagentInputModel)
      .output(openaiagentOutputModel)
      .mutation(async ({ input}) => {
        const { message } = input
        if(typeof message !== "string"){
          return { message: "Invalid message" }
        }
        const result = await  openAiChats.agentsFunctionallity({message})
        if(result){
          return { message: result }
        }
        return { message: "No response from server" }
      })
    });