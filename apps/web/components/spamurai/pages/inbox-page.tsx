'use client';

import { useState, useEffect } from 'react';
import { Mail, Settings, Bell, Search, Menu, Star, Archive, Trash, Clock, ArrowLeft, MoreVertical, Reply, Forward, Tag, Check, CheckCircle2, AlertTriangle, Trash2, X, Send, Filter, Loader2, PenSquare } from 'lucide-react';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { useToast } from '~/hooks/use-toast';
import { usegetUser } from '~/hooks/api/auth/auth';
import { useListMessages, useGetMessage, useSendMessage } from '~/hooks/api/corsair/gmail';

export function InboxPage() {
  const { toast } = useToast();
  const { user } = usegetUser();

  const { listMessagesAsync, isPending: isLoadingList } = useListMessages();
  const { getMessageAsync } = useGetMessage();

  const [emailList, setEmailList] = useState<any[]>([]);
  const [selectedEmailData, setSelectedEmailData] = useState<any>(null);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [starredIds, setStarredIds] = useState<string[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [archivedIds, setArchivedIds] = useState<string[]>([]);

  const [isComposing, setIsComposing] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');

  const { sendMessageAsync, isPending: isSending } = useSendMessage();

  const [isFetchingDetails, setIsFetchingDetails] = useState(false);

  useEffect(() => {
    if (user?.isGmailConnected) {
      setIsFetchingDetails(true);
      listMessagesAsync({ maxResults: 15 }).then(async (res) => {
        if (res?.messages) {
           const basicList = res.messages.map((m: any) => ({
             id: m.id,
             from: "Loading...",
             subject: "Loading...",
             preview: "Loading...",
             time: "",
             urgent: false
           }));
           setEmailList(basicList);

           // Fetch details for each message
           const fullEmails = await Promise.all(
             res.messages.map(async (m: any) => {
               try {
                 const details = await getMessageAsync({ id: m.id, format: 'full' });
                 const headers = details.payload?.headers || [];
                 const getHeader = (name: string) => headers.find((h: any) => h.name.toLowerCase() === name)?.value || '';
                 
                 const fromHeader = getHeader('from');
                 const from = fromHeader.split('<')[0].trim() || fromHeader;
                 const subject = getHeader('subject') || 'No Subject';
                 const dateHeader = getHeader('date');
                 const time = dateHeader ? new Date(dateHeader).toLocaleDateString() : '';

                 return {
                   id: m.id,
                   from,
                   email: fromHeader,
                   subject,
                   preview: details.snippet || '',
                   time,
                   urgent: false,
                   raw: details
                 };
               } catch (e) {
                 return null;
               }
             })
           );
           setEmailList(fullEmails.filter(Boolean));
        }
      }).catch(console.error).finally(() => {
        setIsFetchingDetails(false);
      });
    }
  }, [user?.isGmailConnected]);

  useEffect(() => {
    if (selectedEmail) {
      const email = emailList.find(e => e.id === selectedEmail);
      if (email && email.raw) {
         // Decode body robustly with UTF-8 support
         const decodeBase64Utf8 = (base64: string) => {
            try {
                const binString = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
                const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)!);
                return new TextDecoder().decode(bytes);
            } catch (e) {
                return "";
            }
         };

         const extractBody = (payload: any): { text: string, html: boolean } => {
             if (!payload) return { text: "", html: false };
             if (payload.mimeType === 'text/html' && payload.body?.data) {
                 return { text: decodeBase64Utf8(payload.body.data), html: true };
             }
             if (payload.mimeType === 'text/plain' && payload.body?.data) {
                 return { text: decodeBase64Utf8(payload.body.data), html: false };
             }
             if (payload.parts && payload.parts.length > 0) {
                 for (const part of payload.parts) {
                     if (part.mimeType === 'text/html' && part.body?.data) {
                         return { text: decodeBase64Utf8(part.body.data), html: true };
                     }
                 }
                 for (const part of payload.parts) {
                     if (part.mimeType === 'text/plain' && part.body?.data) {
                         return { text: decodeBase64Utf8(part.body.data), html: false };
                     }
                 }
                 for (const part of payload.parts) {
                     const extracted = extractBody(part);
                     if (extracted.text) return extracted;
                 }
             }
             if (payload.body?.data) {
                 return { text: decodeBase64Utf8(payload.body.data), html: false };
             }
             return { text: "", html: false };
         };

         const extracted = extractBody(email.raw.payload);
         setSelectedEmailData({ ...email, body: extracted.text, isHtml: extracted.html });
      }
    } else {
      setSelectedEmailData(null);
    }
  }, [selectedEmail, emailList]);

  const visibleEmails = emailList.filter(e => !archivedIds.includes(e.id));
  const selected = visibleEmails.find(e => e.id === selectedEmail);

  const handleSelect = (id: string) => {
    setSelectedEmail(id);
    if (!readIds.includes(id)) setReadIds(prev => [...prev, id]);
    setIsEditing(false);
    setIsComposing(false);
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

  const handleSend = async () => {
    if (!editContent || !selectedEmailData) return;

    const headers = selectedEmailData.raw?.payload?.headers || [];
    const messageId = headers.find((h: any) => h.name.toLowerCase() === 'message-id')?.value || '';
    const subject = selectedEmailData.subject.startsWith('Re:') ? selectedEmailData.subject : `Re: ${selectedEmailData.subject}`;
    
    const emailContent = `To: ${selectedEmailData.email}\nSubject: ${subject}\nIn-Reply-To: ${messageId}\nReferences: ${messageId}\nContent-Type: text/plain; charset="UTF-8"\n\n${editContent}`;
    const raw = btoa(unescape(encodeURIComponent(emailContent))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      
    try {
      await sendMessageAsync({ raw, threadId: selectedEmailData.raw.threadId });
      setIsEditing(false);
      setEditContent('');
      toast({ description: `Reply sent to ${selected?.from}` });
    } catch (err) {
      toast({ description: "Failed to send reply", variant: "destructive" });
    }
  };

  const handleSendCompose = async () => {
    if (!composeTo || !composeBody) return;
    
    const emailContent = `To: ${composeTo}\nSubject: ${composeSubject}\nContent-Type: text/plain; charset="UTF-8"\n\n${composeBody}`;
    const raw = btoa(unescape(encodeURIComponent(emailContent))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      
    try {
      await sendMessageAsync({ raw });
      toast({ description: "Message sent successfully" });
      setIsComposing(false);
      setComposeTo('');
      setComposeSubject('');
      setComposeBody('');
    } catch (err) {
      toast({ description: "Failed to send message", variant: "destructive" });
    }
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
          <Button variant="ghost" size="icon" onClick={() => { setIsComposing(true); setSelectedEmail(null); }} title="Compose" className="flex-shrink-0 text-primary hover:bg-primary/10">
            <PenSquare className="w-4 h-4" />
          </Button>
          <div className="flex-1 flex items-center gap-2 bg-secondary/40 rounded-lg px-3 py-1.5 min-w-0">
            <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search..." className="flex-1 min-w-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
          </div>
          <button className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors flex-shrink-0"><Filter className="w-4 h-4 text-muted-foreground" /></button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scroll">
          {isLoadingList || isFetchingDetails ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground">
              <Loader2 className="w-8 h-8 mb-3 animate-spin text-primary" />
              <p className="text-sm">Loading emails...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground">
              <Mail className="w-8 h-8 mb-3 opacity-20" />
              <p className="text-sm">No emails found</p>
              <p className="text-xs opacity-70 mt-1">Connect your Gmail in the Integrations tab to see your emails here.</p>
            </div>
          ) : (
            filtered.map(email => {
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
            })
          )}
        </div>
      </div>

      {/* Email detail */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {isComposing ? (
          <div className="flex-1 flex flex-col p-6 bg-background h-full overflow-hidden">
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
              <h2 className="text-lg font-semibold">New Message</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsComposing(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="space-y-4 flex-1 flex flex-col min-h-0">
              <input 
                placeholder="To" 
                value={composeTo}
                onChange={e => setComposeTo(e.target.value)}
                className="w-full bg-secondary/30 border border-border/40 rounded-lg p-3 text-sm focus:outline-none focus:border-primary/50 flex-shrink-0"
              />
              <input 
                placeholder="Subject" 
                value={composeSubject}
                onChange={e => setComposeSubject(e.target.value)}
                className="w-full bg-secondary/30 border border-border/40 rounded-lg p-3 text-sm focus:outline-none focus:border-primary/50 flex-shrink-0"
              />
              <textarea 
                placeholder="Message" 
                value={composeBody}
                onChange={e => setComposeBody(e.target.value)}
                className="w-full flex-1 bg-secondary/30 border border-border/40 rounded-lg p-3 text-sm focus:outline-none focus:border-primary/50 resize-none min-h-0"
              />
              <div className="flex justify-end gap-2 pt-2 flex-shrink-0">
                <Button variant="ghost" onClick={() => setIsComposing(false)}>Discard</Button>
                <Button onClick={handleSendCompose} disabled={isSending}>
                  {isSending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        ) : selectedEmailData ? (
          <>
            <div className="h-12 flex items-center justify-between px-4 border-b border-border/30 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold truncate">{selectedEmailData.subject}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 px-3 text-sm" onClick={handleEdit}><Reply className="w-4 h-4 mr-1.5" />Reply</Button>
                <Button variant="ghost" size="sm" className="h-8 px-3 text-sm" onClick={handleForward}><Forward className="w-4 h-4 mr-1.5" />Forward</Button>
                <Button variant="ghost" size="sm" className="h-8 px-3 text-sm" onClick={() => handleArchive(selectedEmailData.id)}><Archive className="w-4 h-4 mr-1.5" />Archive</Button>
                <Button variant="ghost" size="sm" className="h-8 px-3 text-sm" onClick={() => handleStar(selectedEmailData.id)}><Star className={cn('w-4 h-4 mr-1.5', starredIds.includes(selectedEmailData.id) ? 'text-primary fill-primary' : '')} />Star</Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scroll p-5">
              <div className="max-w-4xl mx-auto w-full">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/15 flex items-center justify-center text-sm font-semibold text-primary">{selectedEmailData.from.split(' ').map((n: string) => n[0]).join('')}</div>
                  <div>
                    <div className="text-sm font-semibold">{selectedEmailData.from}</div>
                    <div className="text-xs text-muted-foreground">{selectedEmailData.email} &middot; {selectedEmailData.time}</div>
                  </div>
                  {selectedEmailData.urgent && <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/15">Urgent</span>}
                </div>
                {selectedEmailData.isHtml ? (
                  <iframe 
                    srcDoc={selectedEmailData.body} 
                    className="w-full h-[600px] border border-border/20 rounded-lg bg-white" 
                    sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin"
                  />
                ) : (
                  <div className="text-sm text-foreground/85 leading-relaxed whitespace-pre-line">{selectedEmailData.body}</div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="border-t border-border/30 p-4 flex-shrink-0 animate-slide-up">
                <div className="max-w-2xl mx-auto w-full">
                  <div className="text-xs text-muted-foreground mb-2">Replying to {selectedEmailData.from}</div>
                  <textarea value={editContent} onChange={e => setEditContent(e.target.value)}
                    className="w-full h-28 bg-secondary/30 border border-border/40 rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/30 resize-none transition-colors"
                    placeholder="Write your reply..." />
                  <div className="flex items-center gap-2 mt-3">
                    <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 btn-hover" onClick={handleSend} disabled={isSending}>
                      {isSending ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Send className="w-4 h-4 mr-1.5" />}
                      Send Reply
                    </Button>
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
