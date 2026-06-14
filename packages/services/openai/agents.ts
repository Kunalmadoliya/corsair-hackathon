import { OpenAIAgentsProvider } from '@corsair-dev/mcp';
import { Agent, run, tool } from '@openai/agents';
import { corsair } from '../corsair';

import { openaiagentInputModel, OpenAIAgentInputSchemaType } from "./model"


class OpenAiChats {
    public async agentsFunctionallity(message: OpenAIAgentInputSchemaType) {
        const provider = new OpenAIAgentsProvider();
        const tools = provider.build({ corsair, tool });

        const agent = new Agent({
            name: 'corsair-agent',
            instructions:
                'You have access to Corsair tools. Use list_operations to discover ' +
                'available APIs, get_schema to understand arguments, and run_script ' +
                'to execute them.',
            tools,
        });

        const result = await run(agent, message.message);

        return result.finalOutput
    }
}


export default OpenAiChats