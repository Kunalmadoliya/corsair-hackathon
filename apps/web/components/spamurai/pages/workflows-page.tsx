'use client';

import { useState } from 'react';
import { GitBranch, Zap, Play, Pause, Plus, Edit3, Trash2, ArrowRight, X } from 'lucide-react';
import { workflows } from '~/lib/mock-data';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { useToast } from '~/hooks/use-toast';

export function WorkflowsPage() {
  const { toast } = useToast();
  const [workflowList, setWorkflowList] = useState(workflows);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTrigger, setEditTrigger] = useState('');
  const [editAction, setEditAction] = useState('');
  const [editName, setEditName] = useState('');

  const handleToggle = (id: string) => {
    setWorkflowList(prev => prev.map(w => {
      if (w.id === id) {
        const newStatus = w.status === 'active' ? 'paused' as const : 'active' as const;
        toast({ description: `"${w.name}" ${newStatus === 'active' ? 'resumed' : 'paused'}` });
        return { ...w, status: newStatus };
      }
      return w;
    }));
  };

  const handleEdit = (id: string) => {
    const wf = workflowList.find(w => w.id === id);
    if (wf) { setEditingId(id); setEditName(wf.name); setEditTrigger(wf.trigger); setEditAction(wf.action); }
  };

  const handleSave = () => {
    if (editingId) {
      setWorkflowList(prev => prev.map(w => w.id === editingId ? { ...w, name: editName, trigger: editTrigger, action: editAction } : w));
      toast({ description: `Saved "${editName}"` });
    }
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    const wf = workflowList.find(w => w.id === id);
    setWorkflowList(prev => prev.filter(w => w.id !== id));
    setEditingId(null);
    toast({ description: `Deleted "${wf?.name}"` });
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scroll p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Workflows</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Automate repetitive communication tasks</p>
          </div>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 btn-hover" onClick={() => toast({ description: 'New workflow creation coming soon' })}>
            <Plus className="w-4 h-4 mr-1.5" />New Workflow
          </Button>
        </div>

        <div className="space-y-3">
          {workflowList.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-12 text-muted-foreground border border-dashed border-border/40 rounded-xl bg-card/10">
              <GitBranch className="w-8 h-8 mb-3 opacity-20" />
              <p className="text-sm font-medium">No workflows found</p>
              <p className="text-xs opacity-70 mt-1">Create your first workflow to automate your tasks.</p>
            </div>
          ) : (
            workflowList.map(wf => (
              <div key={wf.id} className="rounded-xl border border-border/40 bg-card p-5 card-hover">
                {editingId === wf.id ? (
                  <div className="space-y-3">
                    <div><label className="text-xs text-muted-foreground block mb-1">Name</label><input value={editName} onChange={e => setEditName(e.target.value)} className="w-full bg-secondary/40 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/30 transition-colors" /></div>
                    <div><label className="text-xs text-muted-foreground block mb-1">Trigger</label><input value={editTrigger} onChange={e => setEditTrigger(e.target.value)} className="w-full bg-secondary/40 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/30 transition-colors" /></div>
                    <div><label className="text-xs text-muted-foreground block mb-1">Action</label><input value={editAction} onChange={e => setEditAction(e.target.value)} className="w-full bg-secondary/40 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/30 transition-colors" /></div>
                    <div className="flex items-center gap-2 pt-1">
                      <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 btn-hover" onClick={handleSave}>Save</Button>
                      <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <GitBranch className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-semibold">{wf.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn('text-xs px-2.5 py-1 rounded-full font-medium', wf.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-foreground/5 text-muted-foreground')}>{wf.status}</span>
                        <button onClick={() => handleToggle(wf.id)} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center transition-all hover:scale-110" title={wf.status === 'active' ? 'Pause' : 'Resume'}>
                          {wf.status === 'active' ? <Pause className="w-4 h-4 text-muted-foreground" /> : <Play className="w-4 h-4 text-primary" />}
                        </button>
                        <button onClick={() => handleEdit(wf.id)} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center transition-all hover:scale-110"><Edit3 className="w-4 h-4 text-muted-foreground" /></button>
                        <button onClick={() => handleDelete(wf.id)} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center transition-all hover:scale-110"><Trash2 className="w-4 h-4 text-muted-foreground" /></button>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-3 text-sm">
                      <span className="px-3 py-1 rounded-md bg-primary/8 text-primary border border-primary/15 font-medium">Trigger</span>
                      <span className="text-foreground/50">{wf.trigger}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <span className="px-3 py-1 rounded-md bg-foreground/4 text-foreground/60 border border-border/25">Action</span>
                      <span className="text-foreground/50">{wf.action}</span>
                    </div>
                    <div className="mt-2.5 text-sm text-muted-foreground">{wf.runs} runs executed</div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
