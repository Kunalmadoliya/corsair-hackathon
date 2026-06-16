type DailyBreakdown = { day: string; emails: number; actions: number };
type PricingPlan = { name: string; description: string; price: number | string; features: string[]; highlighted?: boolean; cta: string };
type DemoPrompt = { prompt: string; responses: string[] };
type Email = {
  id: string;
  from: string;
  email: string;
  subject: string;
  preview: string;
  body: string;
  time: string;
  urgent?: boolean;
};
type CalendarEvent = {
  id: string;
  title: string;
  day: string;
  time: string;
  endTime: string;
  attendees: string[];
  type: 'recurring' | 'one-on-one' | 'sprint' | 'client' | string;
  color?: string;
};
type Task = { id: string; title: string; done: boolean };
type Workflow = {
  id: string;
  name: string;
  trigger: string;
  action: string;
  status: 'active' | 'paused';
  runs: number;
};
type Contact = { id: string; name: string; email: string };
type SuggestedAction = { id: string; label: string; description: string };

export const emails: Email[] = [];
export const calendarEvents: CalendarEvent[] = [];
export const tasks: Task[] = [];
export const workflows: Workflow[] = [];
export const contacts: Contact[] = [];
export const analytics = {
  emailsProcessed: 0,
  timeSaved: '0h',
  actionsAutomated: 0,
  responseRate: '0%',
  dailyBreakdown: [] as DailyBreakdown[],
};
export const demoPrompts: DemoPrompt[] = [];
export const suggestedActions: SuggestedAction[] = [];
export const pricingPlans: PricingPlan[] = [];
export const calendarHours = [
  '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM',
];
export const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
