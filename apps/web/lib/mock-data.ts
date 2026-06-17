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

export const emails: Email[] = [
  {
    id: '1',
    from: 'Marcus Vance',
    email: 'marcus@eng.io',
    subject: 'Urgent: Feedback on design system migration',
    preview: 'We need to finalise the CSS custom properties migration by Friday. Can you review the current styles...',
    body: `Hi Team,\n\nWe need to finalise the CSS custom properties migration by Friday. Can you review the current styles and verify they match the Figma tokens?\n\nSpecifically, check the Torii red variables and transition timings in globals.css. Let me know if you spot any discrepancies.\n\nThanks,\nMarcus`,
    time: '2h ago',
    urgent: true,
  },
  {
    id: '2',
    from: 'Sarah Connor',
    email: 'sarah@design.co',
    subject: 'Spamurai Landing Page Assets ready',
    preview: 'Hi! I have uploaded the high-fidelity mockups and clean SVG assets for the new landing page. Let me...',
    body: `Hi there,\n\nI have uploaded the high-fidelity mockups and clean SVG assets for the new landing page. Let me know if you want to make any adjustments before we proceed to coding.\n\nBest,\nSarah`,
    time: '4h ago',
  },
  {
    id: '3',
    from: 'Rahul Sharma',
    email: 'rahul@acmecorp.com',
    subject: 'Partnership Inquiry: Acme Corp x Spamurai',
    preview: 'Hello team, we are interested in exploring a potential integration between our CRM system and Spamurai...',
    body: `Hello Team,\n\nWe are interested in exploring a potential integration between our CRM system and Spamurai. Could we schedule a brief 15-minute intro call sometime next week?\n\nBest regards,\nRahul Sharma`,
    time: '1d ago',
  },
];

export const calendarEvents: CalendarEvent[] = [
  {
    id: 'e1',
    title: 'CSS Migration Sync',
    day: 'Today',
    time: '2:00 PM',
    endTime: '2:30 PM',
    attendees: ['Marcus Vance', 'You'],
    type: 'sprint',
    color: 'bg-primary/20 border-primary/45 text-primary',
  },
  {
    id: 'e2',
    title: 'Acme Corp Intro Call',
    day: 'Tomorrow',
    time: '11:00 AM',
    endTime: '11:15 AM',
    attendees: ['Rahul Sharma', 'You'],
    type: 'client',
  },
  {
    id: 'e3',
    title: 'Design Review & Demo',
    day: 'Friday',
    time: '3:30 PM',
    endTime: '4:30 PM',
    attendees: ['Sarah Connor', 'Marcus Vance', 'You'],
    type: 'one-on-one',
  },
];

export const tasks: Task[] = [
  { id: 't1', title: "Review Marcus's CSS Migration PR", done: false },
  { id: 't2', title: 'Connect Gmail & Calendar', done: true },
  { id: 't3', title: 'Design landing page mockup', done: true },
];

export const workflows: Workflow[] = [
  {
    id: 'w1',
    name: 'Auto-Forward Urgent Client Emails',
    trigger: 'Email from Acme Corp contains "urgent"',
    action: 'Send notification to Slack #urgent-sales',
    status: 'active',
    runs: 24,
  },
  {
    id: 'w2',
    name: 'Schedule Intro Calls Automatically',
    trigger: 'Email matches "schedule intro call"',
    action: 'Reply with booking link and create calendar hold',
    status: 'active',
    runs: 48,
  },
  {
    id: 'w3',
    name: 'Summarize Daily Newsletter Folders',
    trigger: 'Every day at 8:00 AM',
    action: 'Analyze folder and draft one summary email',
    status: 'paused',
    runs: 128,
  },
];

export const contacts: Contact[] = [
  { id: 'c1', name: 'Marcus Vance', email: 'marcus@eng.io' },
  { id: 'c2', name: 'Sarah Connor', email: 'sarah@design.co' },
  { id: 'c3', name: 'Rahul Sharma', email: 'rahul@acmecorp.com' },
];

export const analytics = {
  emailsProcessed: 12470,
  timeSaved: '42h',
  actionsAutomated: 1258,
  responseRate: '92.4%',
  dailyBreakdown: [
    { day: 'Mon', emails: 48, actions: 12 },
    { day: 'Tue', emails: 62, actions: 18 },
    { day: 'Wed', emails: 85, actions: 24 },
    { day: 'Thu', emails: 74, actions: 19 },
    { day: 'Fri', emails: 53, actions: 15 },
    { day: 'Sat', emails: 20, actions: 4 },
    { day: 'Sun', emails: 15, actions: 3 },
  ] as DailyBreakdown[],
};

export const demoPrompts: DemoPrompt[] = [
  {
    prompt: 'Summarize my unread emails and draft a reply to Marcus about the design changes.',
    responses: [
      'Scanning 14 unread emails...',
      'Found urgent email from Marcus: "We need to finalise the CSS custom properties migration by Friday."',
      'Drafted reply to marcus@eng.io: "Hi Marcus, I have reviewed the variables in globals.css. They look correct and match the design specs. Let me know if you need help finalizing the PR. Best, You"'
    ],
  },
  {
    prompt: 'Schedule a sync with Sarah and Marcus tomorrow afternoon to review the landing page design.',
    responses: [
      'Checking Sarah and Marcus\'s calendars...',
      'Found mutual slot: Tomorrow at 3:30 PM - 4:00 PM EST.',
      'Created calendar invite: "Landing Page Design Review Sync". Invitation sent to sarah@design.co and marcus@eng.io.'
    ],
  },
  {
    prompt: 'Create a workflow to forward urgent client intro emails to Slack #demo-alerts.',
    responses: [
      'Configuring new workflow...',
      'Trigger: Incoming email from a client containing "Intro Call" or "Partnership".',
      'Action: Send Slack notification with details to channel #demo-alerts.',
      'Workflow "Client Intro to Slack Alert" is now active!'
    ],
  },
];

export const suggestedActions: SuggestedAction[] = [
  { id: 's1', label: 'Summarize unread emails', description: 'Get a quick digest of your latest messages.' },
  { id: 's2', label: 'Check my schedule today', description: 'See your calendar events and open slots.' },
  { id: 's3', label: 'Draft response to Marcus', description: 'Continue working on the design system PR.' },
];

export const pricingPlans: PricingPlan[] = [
  {
    name: 'Hobby',
    description: 'For individuals looking to streamline their personal inbox.',
    price: 0,
    cta: 'Start Free',
    features: [
      '1 Connected Gmail Inbox',
      'Basic AI Email Drafts',
      'Daily Agenda Summaries',
      '100 AI actions / month',
    ],
  },
  {
    name: 'Pro',
    description: 'For professionals and power users needing advanced automation.',
    price: 19,
    cta: 'Get Started with Pro',
    highlighted: true,
    features: [
      'Unlimited Connected Inboxes',
      'Advanced Calendar Scheduling',
      'Custom Tone & Context Learning',
      '5,000 AI actions / month',
      'Advanced Custom Workflows',
      'Priority Email Support',
    ],
  },
  {
    name: 'Enterprise',
    description: 'For teams requiring customized security, controls, and workflows.',
    price: 49,
    cta: 'Contact Sales',
    features: [
      'Everything in Pro',
      'Custom API Integrations',
      'SAML SSO & Admin Console',
      'Unlimited AI actions',
      '99.9% Uptime SLA',
      'Dedicated Account Manager',
    ],
  },
];

export const calendarHours = [
  '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM',
];
export const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
