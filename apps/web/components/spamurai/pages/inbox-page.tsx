'use client';

import { useState } from 'react';
import { Mail, Star, Archive, Trash2, Reply, Forward, Search, Filter, AlertTriangle, Check, X, Send } from 'lucide-react';
import { emails } from '~/lib/mock-data';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { useToast } from '~/hooks/use-toast';

export function InboxPage() {
    if(!emails){
        throw new Error("Not a valid mail")
    }
  const { toast } = useToast();
  const [selectedEmail, setSelectedEmail] = useState<string | null>(emails[0]!.id);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [emailList, setEmailList] = useState(emails);
  const [starredIds, setStarredIds] = useState<string[]>([]);
  const [readIds, setReadIds] = useState<string[]>(emails.filter(e => !e.unread).map(e => e.id));
  const [archivedIds, setArchivedIds] = useState<string[]>([]);

  const visibleEmails = emailList.filter(e => !archivedIds.includes(e.id));
  const selected = visibleEmails.find(e => e.id === selectedEmail);

  const handleSelect = (id: string) => {
    setSelectedEmail(id);
    if (!readIds.includes(id)) setReadIds(prev => [...prev, id]);
    setIsEditing(false);
  };

  const handleStar = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setStarredIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    const email = emailList.find(em => em.id === id);
    toast({ description: starredIds.includes(id) ? `Unstarred "${email?.subject}"` : `Starred "${email?.subject}"` });
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const email = emailList.find(em => em.id === id);
    setEmailList(prev => prev.filter(em => em.id !== id));
    if (selectedEmail === id) setSelectedEmail(visibleEmails[0]?.id || null);
    toast({ description: `Deleted "${email?.subject}"` });
  };

  const handleArchive = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const email = emailList.find(em => em.id === id);
    setArchivedIds(prev => [...prev, id]);
    if (selectedEmail === id) {
      const next = visibleEmails.find(em => em.id !== id);
      setSelectedEmail(next?.id || null);
    }
    toast({ description: `Archived "${email?.subject}"` });
  };

  const handleEdit = () => {
    if (!selected) return;
    setEditContent(`Thanks for the update. I'll review this and get back to you shortly.\n\nBest regards`);
    setIsEditing(true);
  };

  const handleSend = () => {
    setIsEditing(false);
    setEditContent('');
    toast({ description: `Reply sent to ${selected?.from}` });
  };

  const handleForward = () => {
    toast({ description: 'Forward dialog opened' });
  };

  const filtered = visibleEmails.filter(e =>
    e.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex h-full overflow-hidden">
      {/* Email list */}
      <div className="w-80 lg:w-96 flex-shrink-0 border-r border-border/30 flex flex-col">
        <div className="h-12 flex items-center gap-2 px-3 border-b border-border/30">
          <div className="flex-1 flex items-center gap-2 bg-secondary/40 rounded-lg px-3 py-1.5">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search emails..." className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
          </div>
          <button className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors"><Filter className="w-4 h-4 text-muted-foreground" /></button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scroll">
          {filtered.map(email => {
            const isRead = readIds.includes(email.id);
            const isStarred = starredIds.includes(email.id);
            return (
              <div key={email.id} onClick={() => handleSelect(email.id)}
                className={cn('p-3.5 border-b border-border/15 cursor-pointer transition-all hover:bg-secondary/20', selectedEmail === email.id && 'bg-primary/5 border-l-2 border-l-primary')}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={cn('text-sm font-medium truncate', !isRead && 'text-foreground', isRead && 'text-foreground/60')}>{email.from}</span>
                      {email.urgent && <AlertTriangle className="w-3 h-3 text-primary flex-shrink-0" />}
                    </div>
                    <p className={cn('text-sm mt-0.5 truncate', !isRead && 'text-foreground/85 font-medium', isRead && 'text-foreground/50')}>{email.subject}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{email.preview}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">{email.time}</span>
                </div>
                <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ opacity: selectedEmail === email.id ? 1 : undefined }}>
                  <button onClick={(e) => handleStar(email.id, e)} className="w-7 h-7 rounded-md hover:bg-secondary flex items-center justify-center transition-all hover:scale-110">
                    <Star className={cn('w-3.5 h-3.5 transition-colors', isStarred ? 'text-primary fill-primary' : 'text-muted-foreground')} />
                  </button>
                  <button onClick={(e) => handleArchive(email.id, e)} className="w-7 h-7 rounded-md hover:bg-secondary flex items-center justify-center transition-all hover:scale-110">
                    <Archive className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  <button onClick={(e) => handleDelete(email.id, e)} className="w-7 h-7 rounded-md hover:bg-secondary flex items-center justify-center transition-all hover:scale-110">
                    <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Email detail */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {selected ? (
          <>
            <div className="h-12 flex items-center justify-between px-4 border-b border-border/30 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold truncate">{selected.subject}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 px-3 text-sm" onClick={handleEdit}><Reply className="w-4 h-4 mr-1.5" />Reply</Button>
                <Button variant="ghost" size="sm" className="h-8 px-3 text-sm" onClick={handleForward}><Forward className="w-4 h-4 mr-1.5" />Forward</Button>
                <Button variant="ghost" size="sm" className="h-8 px-3 text-sm" onClick={() => handleArchive(selected.id)}><Archive className="w-4 h-4 mr-1.5" />Archive</Button>
                <Button variant="ghost" size="sm" className="h-8 px-3 text-sm" onClick={() => handleStar(selected.id)}><Star className={cn('w-4 h-4 mr-1.5', starredIds.includes(selected.id) ? 'text-primary fill-primary' : '')} />Star</Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scroll p-5">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/15 flex items-center justify-center text-sm font-semibold text-primary">{selected.from.split(' ').map(n => n[0]).join('')}</div>
                  <div>
                    <div className="text-sm font-semibold">{selected.from}</div>
                    <div className="text-xs text-muted-foreground">{selected.email} &middot; {selected.time}</div>
                  </div>
                  {selected.urgent && <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/15">Urgent</span>}
                </div>
                <div className="text-sm text-foreground/85 leading-relaxed whitespace-pre-line">{selected.body}</div>
              </div>
            </div>

            {isEditing && (
              <div className="border-t border-border/30 p-4 flex-shrink-0 animate-slide-up">
                <div className="max-w-2xl">
                  <div className="text-xs text-muted-foreground mb-2">Replying to {selected.from}</div>
                  <textarea value={editContent} onChange={e => setEditContent(e.target.value)}
                    className="w-full h-28 bg-secondary/30 border border-border/40 rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/30 resize-none transition-colors"
                    placeholder="Write your reply..." />
                  <div className="flex items-center gap-2 mt-3">
                    <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 btn-hover" onClick={handleSend}><Send className="w-4 h-4 mr-1.5" />Send Reply</Button>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">Select an email to read</div>
        )}
      </div>
    </div>
  );
}
