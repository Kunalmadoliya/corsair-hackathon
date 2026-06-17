"use client";

import React from "react";
import { BentoGrid } from "./bento-grid";
import { Logo } from "./logo";
import { Button } from "~/components/ui/button";
import { pricingPlans } from "~/lib/mock-data";
import { 
  ArrowRight, Shield, Zap, MessageSquare, 
  Check, Terminal, Play, Sparkles, Command 
} from "lucide-react";
import { useLogout, usegetUser } from "~/hooks/api/auth/auth";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";

// --- Animation Variants ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 24 } 
  },
};

export function LandingPage() {
  const { user } = usegetUser();
  const router = useRouter();
  const { logoutUserAsync } = useLogout();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary overflow-x-hidden font-sans">
      {/* Dynamic Grid Background Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-background [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo size="md" />
          <div className="hidden md:flex items-center gap-8 bg-muted/50 px-6 py-2 rounded-full border border-border/50">
            {["Features", "How it works", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-foreground transition-all group-hover:w-full" />
              </a>
            ))}
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                className="bg-foreground text-background hover:bg-foreground/90 font-semibold rounded-full px-5 transition-all shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                onClick={() => router.push("/dashboard")}
              >
                Dashboard <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-muted-foreground hover:text-foreground rounded-full"
                onClick={async () => {
                  try {
                    await logoutUserAsync();
                  } catch (e) {
                    console.log(e);
                  }
                  window.location.href = "/";
                }}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-sm font-medium text-muted-foreground hover:text-foreground rounded-full"
                onClick={() => router.push("/auth/login")}
              >
                Log in
              </Button>
              <Button
                size="sm"
                className="bg-foreground text-background hover:bg-foreground/90 hover:scale-105 transition-all rounded-full px-5 font-semibold shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                onClick={() => router.push("/auth/signup")}
              >
                Get Started <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Bento Layout Layer */}
      <main className="relative z-10 pt-32 pb-24 px-6 max-w-7xl mx-auto space-y-6">
        
        {/* Top Hero & Terminal Bento Grid */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[320px] gap-6"
        >
          {/* Bento Box 1: Hero Command (Spans 2x2) */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-2 lg:row-span-2 flex flex-col justify-center rounded-3xl border border-border bg-card/40 backdrop-blur-md p-10 lg:p-14 relative overflow-hidden group hover:border-foreground/30 transition-all duration-500"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-foreground/5 rounded-full blur-[80px] group-hover:bg-foreground/10 transition-colors duration-500 pointer-events-none" />
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-foreground/10 bg-foreground/5 w-fit mb-6">
              <Sparkles className="w-4 h-4 text-foreground animate-pulse" />
              <span className="text-xs font-bold tracking-wide uppercase text-foreground">
                AI Comm OS
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] text-foreground">
              Master <br className="hidden md:block" />
              Communication. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted-foreground">
                Through AI.
              </span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-md font-medium leading-relaxed">
              One workspace. One conversation to orchestrate your entire communications stack. Tell Spamurai what you need, let AI handle the heavy lifting.
            </p>

            <div className="mt-10 flex items-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-foreground text-background px-8 h-12 rounded-full font-bold flex items-center gap-2 shadow-lg transition-all"
                onClick={() => router.push("/auth/signup")}
              >
                Start for Free <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: "rgba(0,0,0,0.05)" }}
                whileTap={{ scale: 0.98 }}
                className="border border-border text-foreground px-6 h-12 rounded-full font-medium flex items-center gap-2 transition-all dark:hover:bg-white/5"
              >
                <Play className="w-4 h-4 text-foreground" /> Watch Demo
              </motion.button>
            </div>
          </motion.div>

          {/* Bento Box 2: Interactive Terminal (Spans 2x2) - FORCED DARK MODE */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-2 lg:row-span-2 rounded-3xl border border-[#222] bg-[#0a0a0a] flex flex-col overflow-hidden relative shadow-2xl group hover:border-[#444] transition-colors duration-500"
          >
            {/* Terminal Header */}
            <div className="h-12 border-b border-[#222] bg-[#111] flex items-center px-4 justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#333] group-hover:bg-red-500 transition-colors" />
                <div className="w-3 h-3 rounded-full bg-[#333] group-hover:bg-yellow-500 transition-colors delay-75" />
                <div className="w-3 h-3 rounded-full bg-[#333] group-hover:bg-green-500 transition-colors delay-150" />
              </div>
              <div className="flex items-center gap-2 text-xs text-[#888] font-mono bg-[#0a0a0a] px-3 py-1 rounded-md border border-[#222]">
                <Command className="w-3 h-3" /> spamurai.sh
              </div>
              <div className="w-16" /> {/* Spacer for centering */}
            </div>

            {/* Terminal Body */}
            <div className="p-6 font-mono text-sm space-y-5 flex-1 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a] z-10 pointer-events-none" />
              
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-start gap-3"
              >
                <span className="text-[#666] mt-0.5">❯</span>
                <p className="text-[#ccc] leading-relaxed">Draft a follow-up email to Rahul summarizing our meeting, schedule a demo for Tuesday, and create a Jira ticket.</p>
              </motion.div>
              
              <div className="space-y-4 pl-5 border-l border-[#222] relative z-0">
                {[
                  { text: "Analyzing semantic request...", color: "text-[#666]", icon: Terminal, delay: 1.2 },
                  { text: "Drafted email to rahul@acmecorp.com", color: "text-white", icon: Sparkles, delay: 1.8 },
                  { text: "Proposed Event: Tuesday, 3:00 PM EST", color: "text-white", icon: Check, delay: 2.4 },
                  { text: "Drafted Jira Ticket: 'Optimize DB pooling'", color: "text-white", icon: Check, delay: 3.0 },
                ].map((log, i) => {
                  const Icon = log.icon;
                  return (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: log.delay }}
                      className="flex items-center gap-3"
                    >
                      <Icon className={`w-3.5 h-3.5 ${log.color === 'text-[#666]' ? 'text-[#666] animate-pulse' : 'text-white'}`} />
                      <span className={`${log.color} font-medium`}>{log.text}</span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Terminal Action Buttons */}
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.5 }}
                className="flex items-center gap-3 pl-5 pt-4 relative z-20"
              >
                <Button size="sm" className="bg-white text-black hover:bg-gray-200 h-8 text-xs rounded-md font-bold">
                  Execute All
                </Button>
                <Button size="sm" variant="ghost" className="text-[#888] hover:text-white h-8 text-xs rounded-md">
                  Modify
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Bento Box 3: Step 01 (1x1) */}
          <BentoStepCard 
            step="01" 
            title="Instruct" 
            desc="Send natural language commands. Zero complex interfaces."
            icon={MessageSquare} 
          />

          {/* Bento Box 4: Step 02 (1x1) */}
          <BentoStepCard 
            step="02" 
            title="AI Stages Work" 
            desc="Agent drafts, checks calendars, and builds tasks silently."
            icon={Zap} 
          />

          {/* Bento Box 5: Step 03 (1x1) */}
          <BentoStepCard 
            step="03" 
            title="Deploy" 
            desc="Review the execution plan in the console and hit deploy."
            icon={Shield} 
          />

          {/* Bento Box 6: Mini CTA Highlight (1x1) */}
          <motion.div 
            variants={itemVariants}
            className="col-span-1 rounded-3xl border border-border bg-muted/30 backdrop-blur-md p-8 flex flex-col justify-center items-center text-center group hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => router.push("/auth/signup")}
          >
            <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <ArrowRight className="w-6 h-6 text-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Start Building</h3>
            <p className="text-sm text-muted-foreground font-medium">Reclaim your time today.</p>
          </motion.div>
        </motion.section>

        {/* External Bento Grid Integration */}
        <section id="features" className="py-12">
          <BentoGrid />
        </section>

        {/* Pricing Bento Layer */}
        <section id="pricing" className="pt-12 pb-24 relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
              Transparent <span className="text-muted-foreground">Pricing.</span>
            </h2>
          </div>

          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-6 auto-rows-[auto]"
          >
            {pricingPlans.map((plan) => (
              <motion.div
                key={plan.name}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className={`rounded-3xl border p-8 flex flex-col transition-all relative overflow-hidden group ${
                  plan.highlighted 
                    ? "border-foreground bg-foreground text-background md:-translate-y-2 shadow-2xl" 
                    : "border-border bg-card/40 backdrop-blur-md text-foreground hover:border-foreground/30"
                }`}
              >
                {/* Subtle Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                {plan.highlighted && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-background text-foreground border border-t-0 border-foreground text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-b-xl shadow-md">
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-xl font-black mt-4">{plan.name}</h3>
                <p className={`text-sm mt-2 font-medium ${plan.highlighted ? "text-background/80" : "text-muted-foreground"}`}>{plan.description}</p>
                
                <div className="mt-6 mb-8 flex items-baseline gap-1">
                  <span className="text-5xl font-black">${plan.price}</span>
                  <span className={`text-sm font-semibold ${plan.highlighted ? "text-background/70" : "text-muted-foreground"}`}>/mo</span>
                </div>
                
                <ul className="space-y-4 flex-1 mb-8">
                  {plan.features.map((f: string) => (
                    <li key={f} className="flex items-start gap-3 text-sm font-medium">
                      <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span className={plan.highlighted ? "text-background/90" : "text-foreground/80"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full h-12 font-bold rounded-xl transition-transform active:scale-95 ${
                    plan.highlighted 
                      ? "bg-background text-foreground hover:bg-background/90" 
                      : "bg-foreground text-background hover:bg-foreground/90"
                  }`}
                  onClick={() => router.push("/auth/signup")}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </section>

      </main>

      {/* Footer Layer */}
      <footer className="border-t border-border/40 bg-background/50 backdrop-blur-lg relative z-10">
        <div className="max-w-7xl mx-auto py-12 px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="sm" showText={true} />
          <div className="flex flex-wrap justify-center gap-8 text-sm font-semibold text-muted-foreground">
            {["Privacy", "Terms", "Security", "Contact"].map((link) => (
              <span key={link} className="hover:text-foreground cursor-pointer transition-colors relative group">
                {link}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- Subcomponent: Small Bento Box for Steps ---
function BentoStepCard({ step, title, desc, icon: Icon }: { step: string, title: string, desc: string, icon: React.ElementType }) {
  return (
    <motion.div 
      variants={itemVariants}
      className="col-span-1 rounded-3xl border border-border bg-card/40 backdrop-blur-md p-8 relative overflow-hidden group hover:border-foreground/30 transition-colors"
    >
      <div className="absolute -bottom-6 -right-6 text-9xl font-black text-foreground/[0.02] pointer-events-none transition-transform group-hover:scale-110 group-hover:-translate-y-2 group-hover:-translate-x-2 duration-500">
        {step}
      </div>
      <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center mb-6 group-hover:bg-foreground transition-colors duration-300">
        <Icon className="w-5 h-5 text-muted-foreground group-hover:text-background transition-colors duration-300" />
      </div>
      <div className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">Step {step}</div>
      <h3 className="text-lg font-bold mb-2 text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground font-medium leading-relaxed relative z-10">{desc}</p>
    </motion.div>
  );
}