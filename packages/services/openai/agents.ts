import { Agent, run, tool } from '@openai/agents';
import { corsair } from '../corsair';

import { OpenAIAgentInputSchemaType } from './model';

const rateLimitMap = new Map<string, number[]>();
const LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // Max 10 requests per minute

function checkGuardrails(message: string): { allowed: boolean; reason?: string } {
  const lowerMessage = message.toLowerCase();

  // 1. Prompt Injection prevention
  const injectionPatterns = [
    "ignore previous instructions",
    "ignore above instructions",
    "ignore all instructions",
    "system prompt",
    "override your instructions",
    "you are no longer a",
    "new role"
  ];
  if (injectionPatterns.some(pattern => lowerMessage.includes(pattern))) {
    return {
      allowed: false,
      reason: "Security Guardrail: Potential prompt injection detected. Instruction override requests are not allowed."
    };
  }

  // 2. Prevent destructive actions (bulk deletion of email/calendar)
  const destructivePatterns = [
    "delete all emails",
    "delete all my emails",
    "delete my emails",
    "clear my calendar",
    "delete all calendar events",
    "delete all meetings",
    "wipe my emails",
    "wipe my calendar"
  ];
  if (destructivePatterns.some(pattern => lowerMessage.includes(pattern))) {
    return {
      allowed: false,
      reason: "Safety Guardrail: Bulk deletion of emails or calendar events is restricted to protect your data."
    };
  }

  return { allowed: true };
}

function checkRateLimit(tenantId: string): { allowed: boolean; reason?: string } {
  const now = Date.now();
  if (!rateLimitMap.has(tenantId)) {
    rateLimitMap.set(tenantId, [now]);
    return { allowed: true };
  }

  const timestamps = rateLimitMap.get(tenantId)!;
  // Filter out timestamps older than the window
  const activeTimestamps = timestamps.filter(t => now - t < LIMIT_WINDOW_MS);
  
  if (activeTimestamps.length >= MAX_REQUESTS) {
    const oldestActive = activeTimestamps[0]!;
    const waitSeconds = Math.ceil((oldestActive + LIMIT_WINDOW_MS - now) / 1000);
    rateLimitMap.set(tenantId, activeTimestamps); // Update with filtered active list
    return { 
      allowed: false, 
      reason: `Rate limit exceeded: You have made too many requests. Please wait ${waitSeconds} seconds before sending another message.` 
    };
  }

  activeTimestamps.push(now);
  rateLimitMap.set(tenantId, activeTimestamps);
  return { allowed: true };
}

class OpenAiChats {
  public async agentsFunctionallity(
    message: OpenAIAgentInputSchemaType,
    tenantId: string,
  ) {
    // 1. Guardrails check
    const guardrailResult = checkGuardrails(message.message);
    if (!guardrailResult.allowed) {
      throw new Error(guardrailResult.reason);
    }

    // 2. Rate limiting check
    const rateLimitResult = checkRateLimit(tenantId);
    if (!rateLimitResult.allowed) {
      throw new Error(rateLimitResult.reason);
    }

    // Dynamic import for ESM-only package
    const { OpenAIAgentsProvider } = await import('@corsair-dev/mcp');

    const provider = new OpenAIAgentsProvider();
    const tenantCorsair = corsair.withTenant(tenantId);
    const tools = provider.build({ corsair: tenantCorsair, tool });

    const agent = new Agent({
      name: 'corsair-agent',
      instructions: `You are Corsair, an advanced AI communications and scheduling companion. 
You have access to the user's Gmail and Google Calendar via the Corsair tools. Use list_operations to discover available APIs, get_schema to understand arguments, and run_script to execute them.

User Context/Memory:
${message.memorySummary ? message.memorySummary : "No memory context available."}

Guidelines:
1. Always be helpful, concise, and professional.
2. When answering email queries, fetch the data required to provide a complete answer.
3. When scheduling, always check calendar availability first.
4. You must format your final answer properly. The UI can parse special metadata if you return a JSON structure like this in your text (but as plain text or markdown, the UI will just render what you say).
Since the UI parses text, structure your response carefully.

Format rules:
- Present information clearly.
- If you did actions, state them.
- When creating or updating calendar events using the Google Calendar API tools, you MUST pass flat parameters like \`title\`, \`start\`, \`end\`, \`description\`, and \`attendees\` directly in the tool arguments. Do not wrap them in \`requestBody\` or \`event\`.`,
      tools,
    });

    const result = await run(agent, message.message);

    return result.finalOutput;
  }
}

export default OpenAiChats;