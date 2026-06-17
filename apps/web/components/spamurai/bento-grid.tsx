"use client";

import React from "react";
import {
  Mail,
  Calendar,
  Users,
  Inbox,
  Zap,
  Layers,
  BarChart3,
  GitBranch,
  ArrowRight,
} from "lucide-react";
import { motion, Variants } from "framer-motion";

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 24 } 
  },
};

const items = [
  {
    title: "AI Email Management",
    description:
      "Intelligent drafting, prioritization, and response generation powered by advanced AI.",
    icon: Mail,
    span: "md:col-span-2",
    mock: (
      <div className="mt-6 space-y-2">
        {[
          { from: "rahul@acmecorp.com", time: "2m" },
          { from: "sarah@design.co", time: "15m" },
          { from: "marcus@eng.io", time: "1h" },
        ].map((e) => (
          <div
            key={e.from}
            className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50 text-sm hover:border-foreground/20 transition-colors"
          >
            <div className="w-2 h-2 rounded-full bg-foreground" />
            <span className="text-foreground font-medium flex-1">{e.from}</span>
            <span className="text-muted-foreground text-xs font-semibold">{e.time}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Calendar Automation",
    description: "Smart scheduling that finds the perfect time for everyone.",
    icon: Calendar,
    span: "",
    mock: (
      <div className="mt-6 space-y-2">
        {[
          { time: "2:00 PM", label: "Product Review" },
          { time: "3:30 PM", label: "Client Demo" },
          { time: "5:00 PM", label: "1:1 Sync" },
        ].map((e) => (
          <div key={e.time} className="p-2.5 rounded-lg bg-muted/50 border border-border/50 text-xs text-muted-foreground flex gap-2 items-center">
            <span className="text-background bg-foreground px-2 py-0.5 rounded font-bold">{e.time}</span> 
            <span className="font-medium text-foreground">{e.label}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Meeting Scheduling",
    description: "AI handles timezones and invitations automatically.",
    icon: Users,
    span: "",
    mock: (
      <div className="mt-6 flex items-center gap-2 flex-wrap">
        {["RS", "SC", "MJ", "LP", "+3"].map((a, i) => (
          <div
            key={a}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold border transition-transform hover:-translate-y-1 ${
              i === 4 ? "bg-foreground text-background border-foreground" : "bg-muted text-foreground border-border"
            }`}
          >
            {a}
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Inbox Summaries",
    description: "Instant digests of your inbox. Never miss what matters.",
    icon: Inbox,
    span: "md:col-span-2",
    mock: (
      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { value: "47", label: "Unread" },
          { value: "12", label: "Urgent" },
          { value: "8", label: "Reply" },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-xl bg-muted/50 border border-border/50 text-center hover:bg-muted transition-colors">
            <div className="text-3xl font-black text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground font-semibold mt-1 uppercase tracking-widest">{s.label}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Workflow Automation",
    description: "Create powerful automations with natural language commands.",
    icon: Zap,
    span: "md:col-span-2",
    mock: (
      <div className="mt-6 flex items-center gap-3 text-sm font-semibold">
        <span className="px-4 py-2 rounded-lg bg-foreground text-background shadow-md">
          Trigger
        </span>
        <ArrowRight className="w-5 h-5 text-muted-foreground animate-pulse" />
        <span className="px-4 py-2 rounded-lg bg-muted text-foreground border border-border">
          Action
        </span>
        <ArrowRight className="w-5 h-5 text-muted-foreground animate-pulse delay-75" />
        <span className="px-4 py-2 rounded-lg bg-muted text-foreground border border-border">
          Result
        </span>
      </div>
    ),
  },
  {
    title: "Multi Inbox",
    description: "All accounts in one interface. Zero chaos.",
    icon: Layers,
    span: "",
    mock: (
      <div className="mt-6 space-y-2">
        {[
          { name: "Work", n: 23 },
          { name: "Personal", n: 8 },
          { name: "Newsletter", n: 16 },
        ].map((e) => (
          <div
            key={e.name}
            className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50 border border-border/50 text-sm"
          >
            <span className="text-muted-foreground font-medium">{e.name}</span>
            <span className="text-foreground font-black bg-background px-2 py-0.5 rounded-md border border-border">{e.n}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Analytics",
    description: "Track communication patterns and productivity.",
    icon: BarChart3,
    // FIX: Changed from span 1 to span 2 to perfectly balance the 4-column grid!
    span: "md:col-span-2",
    mock: (
      <div className="mt-6 flex items-end gap-2 h-20">
        {/* Added 3 more bars to fill the new wider card appropriately */}
        {[40, 65, 35, 80, 55, 30, 95, 45, 75, 20].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-border hover:bg-foreground transition-colors duration-300"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    ),
  },
  {
    title: "Integrations",
    description: "Connect Slack, Notion, Jira, and 50+ tools.",
    icon: GitBranch,
    span: "",
    mock: (
      <div className="mt-6 flex flex-wrap gap-2">
        {["Slack", "Notion", "Jira", "GCal", "Zoom"].map((t) => (
          <span
            key={t}
            className="px-3 py-1.5 rounded-md bg-muted text-xs text-foreground font-bold border border-border hover:border-foreground/30 transition-colors cursor-pointer"
          >
            {t}
          </span>
        ))}
      </div>
    ),
  },
];

export function BentoGrid() {
  return (
    <section className="relative overflow-hidden pt-8">
      {/* Background glow effects - swapped to neutral foreground */}
      <div className="absolute top-[30%] left-[-10%] w-[300px] h-[300px] bg-foreground/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[300px] h-[300px] bg-foreground/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
            Everything you need, <br />
            <span className="text-muted-foreground">one conversation away.</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-lg mx-auto font-medium">
            Replace dozens of disjointed tools with a unified, context-aware AI workspace.
          </p>
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          // Added stretch to ensure all cards in a row equal heights
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 auto-rows-[1fr]"
        >
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                variants={itemVariants}
                key={item.title}
                className={`${item.span} h-full rounded-3xl border border-border bg-card/40 backdrop-blur-md p-8 hover:border-foreground/30 transition-all duration-300 flex flex-col justify-between overflow-hidden relative group`}
              >
                {/* Subtle internal gradient hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                      <Icon className="w-6 h-6 text-foreground group-hover:text-background transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-foreground">{item.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="w-full relative z-10 mt-6">{item.mock}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}