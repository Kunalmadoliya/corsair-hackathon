'use client';

import { DemoConversation } from './demo-conversation';
import { BentoGrid } from './bento-grid';
import { Logo } from './logo';
import { Button } from '~/components/ui/button';
import { pricingPlans } from '~/lib/mock-data';
import { ArrowRight, Shield, Zap, MessageSquare, Check } from 'lucide-react';

interface LandingPageProps { onEnterDashboard?: () => void; }

export function LandingPage({ onEnterDashboard }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 bg-background/85 backdrop-blur-lg">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Logo size="md" />
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it works</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-sm text-muted-foreground" onClick={onEnterDashboard}>Log in</Button>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 btn-hover" onClick={onEnterDashboard}>
              Get Started <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero with background */}
      <section className="hero-bg pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 mb-6 animate-fade-in">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary">AI Communication Operating System</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] animate-fade-in">
            Master Communication<br /><span className="text-gradient">Through Conversation</span>
          </h1>

          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed animate-fade-in">
            One conversation to control your entire communication stack. Tell Spamurai what you want. It handles the rest.
          </p>

          <div className="mt-10 flex items-center justify-center gap-3 animate-fade-in">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 btn-hover px-8" onClick={onEnterDashboard}>
              Start for Free <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-border/50 hover:bg-secondary">
              Watch Demo
            </Button>
          </div>

          <div className="mt-12 animate-fade-in">
            <DemoConversation />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 px-6 border-y border-border/25">
        <div className="max-w-3xl mx-auto grid grid-cols-4 gap-8 text-center">
          {[{ v: '10K+', l: 'Users' }, { v: '2M+', l: 'Emails' }, { v: '38h', l: 'Saved/Week' }, { v: '99.9%', l: 'Uptime' }].map(s => (
            <div key={s.l}><div className="text-2xl md:text-3xl font-bold text-gradient">{s.v}</div><div className="text-sm text-muted-foreground mt-1">{s.l}</div></div>
          ))}
        </div>
      </section>

      <BentoGrid />

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-6 border-t border-border/25">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Three steps to <span className="text-gradient">mastery</span></h2>
            <p className="mt-2 text-base text-muted-foreground">No setup. No training. Just start talking.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { step: '01', icon: MessageSquare, title: 'Tell Spamurai what you need', desc: 'Type a natural language command. No menus, no clicks, no learning curve.' },
              { step: '02', icon: Zap, title: 'It handles the work', desc: 'Spamurai drafts emails, schedules meetings, finds information, and executes workflows.' },
              { step: '03', icon: Shield, title: 'Confirm and done', desc: 'Review the action, make adjustments if needed, and confirm. Everything else is automated.' },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="text-center card-hover rounded-xl p-5">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-xs text-primary font-mono mb-2">{item.step}</div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 border-t border-border/25">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold"><span className="text-gradient">Simple</span> pricing</h2>
            <p className="mt-2 text-base text-muted-foreground">Start free. Upgrade when you need more.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {pricingPlans.map(plan => (
              <div key={plan.name} className={`rounded-xl border p-6 flex flex-col card-hover ${plan.highlighted ? 'border-primary/35 bg-primary/4 ring-1 ring-primary/20' : 'border-border/40 bg-card'}`}>
                {plan.highlighted && <div className="text-xs font-semibold text-primary mb-3 uppercase tracking-wider">Most Popular</div>}
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                <div className="mt-4 mb-5"><span className="text-4xl font-bold">${plan.price}</span><span className="text-base text-muted-foreground">/mo</span></div>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground/80"><Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />{f}</li>
                  ))}
                </ul>
                <Button className={`w-full btn-hover ${plan.highlighted ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`} onClick={onEnterDashboard}>{plan.cta}</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-border/25 hero-bg">
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="text-3xl font-bold">Ready to let AI handle <span className="text-gradient">your communications?</span></h2>
          <p className="mt-3 text-base text-muted-foreground">Join thousands who reclaimed their time.</p>
          <Button size="lg" className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90 btn-hover px-8" onClick={onEnterDashboard}>
            Start for Free <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <p className="mt-3 text-sm text-muted-foreground">No credit card required</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border/25">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" showText={true} />
          <div className="flex items-center gap-6 text-sm text-muted-foreground"><span className="hover:text-foreground cursor-pointer transition-colors">Privacy</span><span className="hover:text-foreground cursor-pointer transition-colors">Terms</span><span className="hover:text-foreground cursor-pointer transition-colors">Security</span><span className="hover:text-foreground cursor-pointer transition-colors">Contact</span></div>
        </div>
      </footer>
    </div>
  );
}
