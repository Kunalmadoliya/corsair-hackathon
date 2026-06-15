export const emails = [
  { id: '1', from: 'Rahul Sharma', email: 'rahul@acmecorp.com', subject: 'Q3 Revenue Projections - Updated Numbers', preview: 'Hey, I just finished the updated Q3 revenue projections. The numbers look strong, especially in the APAC region where we saw a 23% increase.', body: 'Hey,\n\nI just finished the updated Q3 revenue projections. The numbers look strong, especially in the APAC region where we saw a 23% increase. Let me know if you want to review before the board meeting.\n\nBest,\nRahul', time: '10:24 AM', unread: true, urgent: true },
  { id: '2', from: 'Sarah Chen', email: 'sarah@design.co', subject: 'New brand guidelines ready for review', preview: 'The design team has finalized the new brand guidelines. We went with a minimalist approach incorporating your feedback.', body: 'Hi,\n\nThe design team has finalized the new brand guidelines. We went with a more minimalist approach this time, incorporating the feedback from last sprint. Attached are the final files.\n\nCheers,\nSarah', time: '9:45 AM', unread: true, urgent: false },
  { id: '3', from: 'Marcus Johnson', email: 'marcus@engteam.io', subject: 'Deployment scheduled for tomorrow 2PM', preview: 'Just confirming the deployment window. QA green light, all 847 tests passing, rollback plan documented.', body: 'Hey team,\n\nJust confirming the deployment window for tomorrow at 2PM EST. We have the green light from QA and all 847 tests are passing. Rollback plan is documented in Confluence.\n\nMarcus', time: '9:12 AM', unread: true, urgent: true },
  { id: '4', from: 'Lisa Park', email: 'lisa@clientservices.com', subject: 'Client feedback - Project Horizon', preview: 'Client approved Phase 2 deliverables with minor UI suggestions. Nothing blocking.', body: "Hi,\n\nGreat news! The client has approved the Phase 2 deliverables. They had some minor suggestions for the UI polish, which I've documented. Nothing blocking.\n\nBest,\nLisa", time: '8:30 AM', unread: false, urgent: false },
  { id: '5', from: 'Dev Patel', email: 'dev@analytics.io', subject: 'Weekly analytics report', preview: 'DAU up 12%, retention improved to 68%, churn down 3% MoM. Full report attached.', body: 'Hey,\n\n- DAU: up 12% WoW\n- Retention: improved to 68% (from 61%)\n- Churn: down 3% MoM\n- Revenue per user: $4.20 (up $0.35)\n\nFull report attached.\nDev', time: 'Yesterday', unread: false, urgent: false },
  { id: '6', from: 'Tomoko Suzuki', email: 'tomoko@partners.jp', subject: 'Partnership proposal - Tokyo expansion', preview: 'Strategic partnership proposal for the Tokyo market. Our local expertise combined with your platform...', body: 'Dear Team,\n\nWe would like to propose a strategic partnership for the Tokyo market expansion. Our local expertise combined with your platform could create significant synergies.\n\nBest regards,\nTomoko Suzuki', time: 'Yesterday', unread: true, urgent: false },
];

export const calendarEvents = [
  { id: '1', title: 'Weekly Product Review', date: '2024-01-19', day: 'Fri', time: '2:00 PM', endTime: '3:00 PM', attendees: ['Rahul S.', 'Sarah C.', 'Marcus J.', 'Lisa P.', 'Dev P.', 'Tomoko S.'], type: 'recurring' as const, color: 'primary' as const },
  { id: '2', title: '1:1 with Rahul', date: '2024-01-17', day: 'Wed', time: '11:00 AM', endTime: '11:30 AM', attendees: ['Rahul S.'], type: 'one-on-one' as const, color: 'white' as const },
  { id: '3', title: 'Design Sprint Kickoff', date: '2024-01-22', day: 'Mon', time: '10:00 AM', endTime: '12:00 PM', attendees: ['Sarah C.', 'Marcus J.', 'Lisa P.', 'Dev P.'], type: 'sprint' as const, color: 'primary' as const },
  { id: '4', title: 'Client Demo - Horizon', date: '2024-01-18', day: 'Thu', time: '3:00 PM', endTime: '4:00 PM', attendees: ['Lisa P.', 'Rahul S.'], type: 'client' as const, color: 'white' as const },
  { id: '5', title: 'Engineering Standup', date: '2024-01-17', day: 'Wed', time: '9:30 AM', endTime: '9:45 AM', attendees: ['Marcus J.', 'Dev P.', 'Sarah C.'], type: 'recurring' as const, color: 'primary' as const },
  { id: '6', title: 'Tokyo Partnership Call', date: '2024-01-19', day: 'Fri', time: '4:00 PM', endTime: '5:00 PM', attendees: ['Tomoko S.', 'Lisa P.'], type: 'client' as const, color: 'white' as const },
  { id: '7', title: 'Sprint Retrospective', date: '2024-01-19', day: 'Fri', time: '11:00 AM', endTime: '12:00 PM', attendees: ['Marcus J.', 'Sarah C.', 'Dev P.', 'Rahul S.'], type: 'recurring' as const, color: 'primary' as const },
  { id: '8', title: 'Lunch with Investor', date: '2024-01-17', day: 'Wed', time: '12:30 PM', endTime: '1:30 PM', attendees: ['Rahul S.'], type: 'one-on-one' as const, color: 'white' as const },
];

export const tasks = [
  { id: '1', title: 'Review Q3 projections', status: 'in-progress' as const, priority: 'high' as const, due: 'Today' },
  { id: '2', title: 'Approve brand guidelines', status: 'pending' as const, priority: 'medium' as const, due: 'Tomorrow' },
  { id: '3', title: 'Confirm deployment window', status: 'completed' as const, priority: 'high' as const, due: 'Today' },
  { id: '4', title: 'Prepare client demo', status: 'in-progress' as const, priority: 'high' as const, due: 'Wednesday' },
  { id: '5', title: 'Update partnership proposal', status: 'pending' as const, priority: 'low' as const, due: 'Next week' },
  { id: '6', title: 'Review analytics dashboard', status: 'pending' as const, priority: 'medium' as const, due: 'Friday' },
  { id: '7', title: 'Send meeting notes to team', status: 'completed' as const, priority: 'low' as const, due: 'Yesterday' },
  { id: '8', title: 'Draft Q4 planning doc', status: 'pending' as const, priority: 'high' as const, due: 'Monday' },
];

export const workflows = [
  { id: '1', name: 'New Client Email', trigger: 'Email from new client', action: 'Create follow-up + send welcome', status: 'active' as const, runs: 47 },
  { id: '2', name: 'Meeting Follow-up', trigger: 'Calendar event ends', action: 'Generate notes + send to attendees', status: 'active' as const, runs: 23 },
  { id: '3', name: 'Invoice Detection', trigger: 'Email contains invoice', action: 'Extract amount + log to finance', status: 'active' as const, runs: 12 },
  { id: '4', name: 'Urgent Alert', trigger: 'Email marked urgent', action: 'Slack notification + prioritize', status: 'paused' as const, runs: 8 },
  { id: '5', name: 'Daily Digest', trigger: 'Every morning at 8 AM', action: 'Summarize unread + send digest', status: 'active' as const, runs: 156 },
  { id: '6', name: 'Auto-archive', trigger: 'Email older than 30 days', action: 'Archive if no response needed', status: 'active' as const, runs: 234 },
];

export const contacts = [
  { id: '1', name: 'Rahul Sharma', role: 'VP Finance', company: 'Acme Corp', avatar: 'RS', email: 'rahul@acmecorp.com' },
  { id: '2', name: 'Sarah Chen', role: 'Design Lead', company: 'Design Co', avatar: 'SC', email: 'sarah@design.co' },
  { id: '3', name: 'Marcus Johnson', role: 'Eng Manager', company: 'Eng Team IO', avatar: 'MJ', email: 'marcus@engteam.io' },
  { id: '4', name: 'Lisa Park', role: 'Client Success', company: 'Client Services', avatar: 'LP', email: 'lisa@clientservices.com' },
  { id: '5', name: 'Dev Patel', role: 'Data Analyst', company: 'Analytics IO', avatar: 'DP', email: 'dev@analytics.io' },
  { id: '6', name: 'Tomoko Suzuki', role: 'Partner Lead', company: 'Partners JP', avatar: 'TS', email: 'tomoko@partners.jp' },
];

export const analytics = {
  emailsProcessed: 1247,
  timeSaved: '38h',
  actionsAutomated: 312,
  responseRate: '94%',
  dailyBreakdown: [
    { day: 'Mon', emails: 45, actions: 12 },
    { day: 'Tue', emails: 52, actions: 18 },
    { day: 'Wed', emails: 38, actions: 9 },
    { day: 'Thu', emails: 61, actions: 22 },
    { day: 'Fri', emails: 48, actions: 15 },
    { day: 'Sat', emails: 12, actions: 3 },
    { day: 'Sun', emails: 8, actions: 2 },
  ],
};

export const demoPrompts = [
  { prompt: 'Send an email to Rahul about tomorrow\'s deployment.', responses: ['Draft created', 'Rahul found in contacts', 'Email ready to send', 'Waiting for confirmation'] },
  { prompt: 'Summarize my unread emails.', responses: ['47 unread emails found', '12 marked urgent', '8 require response', '3 meetings scheduled', 'Summary generated'] },
  { prompt: 'Schedule a call with the product team.', responses: ['Calendar checked', 'Available slot found', 'Meeting scheduled', 'Invitations sent to 6 attendees'] },
  { prompt: 'Follow up with everyone who ignored my last email.', responses: ['23 recipients identified', 'Follow-up drafts generated', 'Personalized per contact', 'Ready to send'] },
];

export const suggestedActions = [
  { label: 'Summarize inbox', description: 'Get a digest of recent emails' },
  { label: 'Draft follow-ups', description: 'Generate reply drafts' },
  { label: 'Schedule meetings', description: 'Find available time slots' },
  { label: 'Find important emails', description: 'Search across all inboxes' },
  { label: 'Create workflows', description: 'Automate repetitive tasks' },
];

export const pricingPlans = [
  {
    name: 'Starter',
    price: '0',
    description: 'For individuals getting started',
    features: ['100 emails/month', 'Basic AI commands', '1 inbox', 'Email summaries', 'Community support'],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '29',
    description: 'For professionals who communicate daily',
    features: ['Unlimited emails', 'Advanced AI commands', '5 inboxes', 'Calendar automation', 'Workflow builder', 'Priority support', 'Analytics dashboard'],
    cta: 'Start Pro Trial',
    highlighted: true,
  },
  {
    name: 'Team',
    price: '79',
    description: 'For teams that need collaboration',
    features: ['Everything in Pro', 'Unlimited team members', 'Shared workflows', 'Team analytics', 'Admin controls', 'SSO & SAML', 'Dedicated account manager'],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export const calendarHours = [
  '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM',
];

export const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
