'use client';

import { analytics } from '~/lib/mock-data';

export function AnalyticsPage() {
  return (
    <div className="flex-1 overflow-y-auto custom-scroll p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold">Analytics</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Track your communication patterns and productivity</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Emails Processed', value: analytics.emailsProcessed.toLocaleString(), sub: '+12% this week' },
            { label: 'Time Saved', value: analytics.timeSaved, sub: 'vs manual handling' },
            { label: 'Actions Automated', value: analytics.actionsAutomated.toLocaleString(), sub: '+8% this week' },
            { label: 'Response Rate', value: analytics.responseRate, sub: 'above industry avg' },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-border/40 bg-card p-4 card-hover">
              <div className="text-2xl font-bold text-foreground/90">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{s.label}</div>
              <div className="text-xs text-primary mt-1">{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border/40 bg-card p-5 mb-6">
          <div className="text-sm font-semibold mb-4">Daily Activity</div>
          <div className="flex items-end gap-3 h-36">
            {analytics.dailyBreakdown.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
                Awaiting data
              </div>
            ) : (
              analytics.dailyBreakdown.map(day => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col gap-px" style={{ height: '90px' }}>
                    <div className="w-full rounded-sm bg-primary/30 hover:bg-primary/50 transition-colors" style={{ height: `${(day.emails / 65) * 100}%` }} />
                    <div className="w-full rounded-sm bg-foreground/10 hover:bg-foreground/20 transition-colors" style={{ height: `${(day.actions / 25) * 100}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground">{day.day}</span>
                </div>
              ))
            )}
          </div>
          <div className="flex items-center gap-5 mt-4">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-primary/30" /><span className="text-xs text-muted-foreground">Emails</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-foreground/10" /><span className="text-xs text-muted-foreground">Automated Actions</span></div>
          </div>
        </div>

        <div className="rounded-xl border border-border/40 bg-card overflow-hidden">
          <div className="px-5 py-3 border-b border-border/30 text-sm font-semibold">Weekly Breakdown</div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/20 text-xs text-muted-foreground">
                <th className="px-5 py-2.5 text-left font-medium">Day</th>
                <th className="px-5 py-2.5 text-right font-medium">Emails</th>
                <th className="px-5 py-2.5 text-right font-medium">Actions</th>
                <th className="px-5 py-2.5 text-right font-medium">Ratio</th>
              </tr>
            </thead>
            <tbody>
              {analytics.dailyBreakdown.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-muted-foreground text-sm">
                    No data available yet. Connect your integrations to start gathering analytics.
                  </td>
                </tr>
              ) : (
                analytics.dailyBreakdown.map(day => (
                  <tr key={day.day} className="border-b border-border/8 text-sm hover:bg-secondary/20 transition-colors">
                    <td className="px-5 py-2.5 text-foreground/80">{day.day}</td>
                    <td className="px-5 py-2.5 text-right text-foreground/60">{day.emails}</td>
                    <td className="px-5 py-2.5 text-right text-foreground/60">{day.actions}</td>
                    <td className="px-5 py-2.5 text-right text-primary font-medium">{Math.round((day.actions / day.emails) * 100)}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
