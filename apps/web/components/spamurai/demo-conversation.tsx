'use client';

import { useState, useEffect, useCallback } from 'react';
import { Check, Send } from 'lucide-react';
import { demoPrompts } from '~/lib/mock-data';

export function DemoConversation() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'responding' | 'done'>('typing');
  const [typedText, setTypedText] = useState('');
  const [visibleResponses, setVisibleResponses] = useState<number[]>([]);

  const current = demoPrompts[activeIdx];

  if (!current) {
    return null;
  }

  const runDemo = useCallback(() => {
    setPhase('typing');
    setTypedText('');
    setVisibleResponses([]);
    let charIdx = 0;
    const typeInterval = setInterval(() => {
      charIdx++;
      setTypedText(current.prompt.slice(0, charIdx));
      if (charIdx >= current.prompt.length) {
        clearInterval(typeInterval);
        setPhase('responding');
        current.responses.forEach((_, i) => {
          setTimeout(() => setVisibleResponses(prev => [...prev, i]), (i + 1) * 400);
        });
        setTimeout(() => setPhase('done'), current.responses.length * 400 + 600);
      }
    }, 28);
    return () => clearInterval(typeInterval);
  }, [activeIdx, current]);

  useEffect(() => { const c = runDemo(); return c; }, [runDemo]);
  useEffect(() => { if (phase !== 'done') return; const t = setTimeout(() => setActiveIdx(p => (p + 1) % demoPrompts.length), 2000); return () => clearTimeout(t); }, [phase]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="rounded-xl border border-border/40 bg-card p-6 md:p-8 space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-foreground/80">You</span>
          </div>
          <p className="text-sm text-foreground/90 pt-0.5 leading-relaxed">
            {phase === 'typing' ? (<>{typedText}<span className="inline-block w-[2px] h-4 bg-primary ml-0.5 animate-blink align-middle" /></>) : current.prompt}
          </p>
        </div>
        {phase !== 'typing' && (
          <div className="flex items-start gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-lg bg-primary/12 border border-primary/25 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-primary">AI</span>
            </div>
            <div className="flex-1 space-y-2 pt-0.5">
              {current.responses.map((resp, i) => (
                <div key={i} className={`flex items-center gap-2 transition-all duration-300 ${visibleResponses.includes(i) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                  <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0"><Check className="w-2.5 h-2.5 text-primary" /></div>
                  <span className="text-sm text-foreground/75">{resp}</span>
                </div>
              ))}
              {visibleResponses.length === current.responses.length && (
                <button className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 btn-hover animate-fade-in">
                  <Send className="w-4 h-4" />Confirm & Send
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-center gap-2 mt-5">
        {demoPrompts.map((_, i) => (
          <button key={i} onClick={() => { setActiveIdx(i); setPhase('typing'); setTypedText(''); setVisibleResponses([]); }}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIdx ? 'w-10 bg-primary' : 'w-4 bg-border hover:bg-muted-foreground/40'}`}
          />
        ))}
      </div>
    </div>
  );
}
