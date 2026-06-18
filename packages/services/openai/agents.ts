import { Agent, run, tool } from '@openai/agents';
import { z } from 'zod';
import { corsair } from '../corsair';
import { corsairGmailService } from '../corsair/gmail';

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

    const smartListMessages = tool({
      name: 'smartListMessages',
      description: 'Fetch the latest emails from the inbox, including full content and metadata, optimized for summarization. Use this tool whenever the user asks to see their latest emails or inbox instead of the default listMessages tool.',
      parameters: z.object({
        limit: z.number().max(20).default(10).describe('Number of recent emails to fetch'),
      }),
      execute: async ({ limit }) => {
        try {
          const listRes = await corsairGmailService.listMessages(tenantId, { maxResults: limit });
          const messages = listRes?.messages || [];
          if (messages.length === 0) return { result: "No emails found." };

          const fullMessages = await Promise.all(
            messages.map((m: any) => 
              corsairGmailService.getMessage(tenantId, { id: m.id, format: "full" })
            )
          );

          const structuredEmails = fullMessages.map((msg: any) => {
            const headers = msg.payload?.headers || [];
            const getHeader = (name: string) => headers.find((h: any) => h.name?.toLowerCase() === name.toLowerCase())?.value || '';

            const subject = getHeader('subject');
            const from = getHeader('from');
            const to = getHeader('to');
            const date = getHeader('date');

            let bodyText = msg.snippet || '';

            const extractBody = (part: any): string => {
                if (part.mimeType === 'text/plain' && part.body?.data) {
                    return Buffer.from(part.body.data, 'base64url').toString('utf-8');
                }
                if (part.parts) {
                    for (const p of part.parts) {
                        if (p.mimeType === 'text/plain' && p.body?.data) {
                            return Buffer.from(p.body.data, 'base64url').toString('utf-8');
                        }
                    }
                    for (const p of part.parts) {
                        const extracted = extractBody(p);
                        if (extracted) return extracted;
                    }
                }
                if (part.body?.data) {
                    return Buffer.from(part.body.data, 'base64url').toString('utf-8');
                }
                return '';
            };

            const fullBody = extractBody(msg.payload);
            if (fullBody && fullBody.length > bodyText.length) {
                bodyText = fullBody.replace(/<[^>]*>?/gm, '').replace(/\\s+/g, ' ').trim().substring(0, 1500);
            }

            return {
              id: msg.id,
              threadId: msg.threadId,
              subject,
              sender: from,
              recipient: to,
              date,
              contentPreview: bodyText || 'No content available'
            };
          });

          return { result: structuredEmails };
        } catch (error: any) {
          return { error: error.message };
        }
      }
    });

    tools.push(smartListMessages);

    const agent = new Agent({ 
      name: 'corsair-agent',
      instructions: `You are Corsair, an advanced AI communications and scheduling companion. 
      
You have access to the user's Gmail and Google Calendar via the Corsair tools. Use list_operations to discover available APIs, get_schema to understand arguments, and run_script to execute them.

User Context/Memory:
${message.memorySummary ? message.memorySummary : "No memory context available."}

Previous Chat History:
${message.chatHistory && message.chatHistory.length > 0 
  ? message.chatHistory.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n')
  : "No previous messages in this chat."}

Guidelines:
1. Always be helpful, concise, and professional.
2. When answering email queries, fetch the data required to provide a complete answer.
3. When scheduling, always check calendar availability first.
4. You must format your final answer properly. The UI can parse special metadata if you return a JSON structure like this in your text (but as plain text or markdown, the UI will just render what you say).
Since the UI parses text, structure your response carefully.

Format rules:
- YOU MUST USE CLEAN, PROFESSIONAL MARKDOWN for all responses.
- Use bullet points, bold text, and line breaks to organize information clearly.
- NEVER dump raw IDs (like email thread IDs or calendar event IDs) to the user unless explicitly requested.
- When summarizing emails, ALWAYS use the 'smartListMessages' tool to fetch the full content context.
- For each email summary, extract and clearly display the Sender, Subject, Date, a 1-2 sentence AI-generated Summary, Action Items (if any), and Priority Level (High/Medium/Low). 
- Example format for emails:
  📧 **Subject: Interview Invitation**
  👤 From: Google Careers
  📅 Date: Jun 18, 2026
  📝 **Summary:** Google has invited you to schedule a technical interview.
  ⚡ **Action Items:** 
  • Select interview slot
  • Confirm attendance
  🔥 **Priority:** High

- When listing calendar events, show the Date, Time, Title, and Attendees cleanly.
- If you performed actions (like sending an email or creating an event), state them clearly at the end of your response.
- When sending emails using the Gmail API tool (e.g., sendMessage), the tool requires a 'raw' parameter. This parameter MUST be a base64url encoded string of the full MIME message. First, construct the email in plain text: "To: recipient@example.com\nSubject: Your Subject\nContent-Type: text/plain; charset=UTF-8\n\nYour message body". Then, base64url encode this entire string and pass it as the 'raw' argument.
- When creating or updating calendar events using the Google Calendar API tools, you MUST wrap your parameters inside a \`requestBody\` object. For example: \`{ "calendarId": "primary", "requestBody": { "summary": "Meeting Title", "start": { "dateTime": "2026-06-20T15:00:00Z" }, "end": { "dateTime": "2026-06-20T16:00:00Z" }, "attendees": [{"email": "example@example.com"}] } }\`. Do NOT use flat parameters like \`title\` or \`start\`.
- **CRITICAL - ACTION CARDS**: When you successfully perform an action (like sending an email or scheduling a meeting), DO NOT just write plain text. You MUST output a structured JSON tag so the UI can render a beautiful card. 
Format: \`[ACTION_CARD: {"type": "EVENT_CREATED", "title": "Meeting Name", "date": "Tomorrow", "time": "5:00 PM"}]\` or \`[ACTION_CARD: {"type": "EMAIL_SENT", "recipient": "name@example.com", "subject": "Hello"}]\`. Place this tag on its own line at the very end of your response.`,
      tools,
    });

    const result = await run(agent, message.message);

    return result.finalOutput;
  }
}
    

export default OpenAiChats;