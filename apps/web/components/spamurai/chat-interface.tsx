'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, Mail, Calendar, Users, Search, Zap, FileText, Check, Clock } from 'lucide-react';
import { suggestedActions } from '~/lib/mock-data';
import { useToast } from '~/hooks/use-toast';
import { trpc } from '~/trpc/client';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  actions?: string[];
  card?: { type: 'email' | 'calendar'; data: Record<string, string | number> };
}

function getActionIcon(text: string): React.ElementType {
  const l = text.toLowerCase();
  if (l.includes('email') || l.includes('draft')) return Mail;
  if (l.includes('calendar') || l.includes('meeting') || l.includes('scheduled')) return Calendar;
  if (l.includes('inbox') || l.includes('unread')) return Search;
  if (l.includes('urgent') || l.includes('response')) return Clock;
  if (l.includes('contact') || l.includes('recipient') || l.includes('attendee')) return Users;
  if (l.includes('workflow') || l.includes('automat')) return Zap;
  if (l.includes('summary') || l.includes('generated') || l.includes('personalized')) return FileText;
  if (l.includes('ready') || l.includes('confirmed') || l.includes('slot') || l.includes('found') || l.includes('checked') || l.includes('identified')) return Check;
  if (l.includes('sent') || l.includes('invitation')) return Send;
  return Check;
}

interface ChatInterfaceProps {
  chatId: string | undefined;
  setChatId: (id: string | undefined) => void;
  onNewChat: () => void;
}

export function ChatInterface({ chatId, setChatId, onNewChat }: ChatInterfaceProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'assistant', content: 'Welcome back! I am Corsair, your AI communications companion. I am connected to your Gmail and Google Calendar. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<Record<string, string>>({});
  const bottomRef = useRef<HTMLDivElement>(null);

  const trpcUtils = trpc.useUtils();
  const { data: chatHistory, isLoading: isLoadingChat } = trpc.chat.listChats.useQuery({});
  const { data: latestChatData } = trpc.chat.getChat.useQuery(
    { chatId: chatId || '' },
    { enabled: !!chatId }
  );

  useEffect(() => {
    // If we have history, load the most recent chat
    if (chatHistory?.chats && chatHistory.chats.length > 0 && !chatId) {
        setChatId(chatHistory.chats[0].id);
    }
  }, [chatHistory, chatId]);

  useEffect(() => {
      if (latestChatData?.messages) {
          const loadedMessages = latestChatData.messages.map((m: any) => ({
              id: m.id,
              role: m.role as 'user' | 'assistant',
              content: m.content
          }));
          if (loadedMessages.length > 0) {
              setMessages(loadedMessages);
          }
      }
  }, [latestChatData, chatId]);

  const handleNewChat = () => {
    onNewChat();
    setMessages([{ id: '0', role: 'assistant', content: 'Welcome back! I am Corsair, your AI communications companion. I am connected to your Gmail and Google Calendar. How can I help you today?' }]);
  };

  const { mutateAsync: chatWithAgent } = trpc.openaiagents.openaiagent.useMutation();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isProcessing]);

  const handleSubmit = async (text: string) => {
    if (!text.trim() || isProcessing) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    try {
      const res = await chatWithAgent({ message: text.trim(), chatId });
      if (res.chatId && !chatId) {
          setChatId(res.chatId);
          trpcUtils.chat.listChats.invalidate();
      }
      let finalContent = res.message;
      let cardData: any = undefined;

      const cardMatch = finalContent.match(/\[ACTION_CARD:\s*(\{.*?\})\s*\]/);
      if (cardMatch && cardMatch[1] && cardMatch[0]) {
          try {
              const parsed = JSON.parse(cardMatch[1]);
              finalContent = finalContent.replace(cardMatch[0], '').trim();
              
              if (parsed.type === 'EVENT_CREATED' || parsed.type === 'CALENDAR') {
                  cardData = { type: 'calendar', data: { ...parsed, status: 'Confirmed' } };
              } else if (parsed.type === 'EMAIL_SENT' || parsed.type === 'EMAIL') {
                  cardData = { type: 'email', data: { to: parsed.recipient || parsed.to, subject: parsed.subject, preview: parsed.preview || '', status: 'Sent' } };
              } else {
                  cardData = { type: 'calendar', data: parsed };
              }
          } catch (e) {
              console.error("Failed to parse ACTION_CARD JSON", e);
          }
      }

      const assistantMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: finalContent,
        card: cardData
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to communicate with Corsair agent.",
        variant: "destructive",
      });
      const errorMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Sorry, I encountered an error while communicating with Corsair. Please try again.",
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditCard = (msgId: string, cardData: Record<string, string | number>) => {
    setEditingCard(msgId);
    const fields: Record<string, string> = {};
    Object.entries(cardData).forEach(([k, v]) => { fields[k] = String(v); });
    setEditFields(fields);
  };

  const handleSaveCard = (msgId: string) => {
    setMessages(prev => prev.map(m => m.id === msgId && m.card ? { ...m, card: { ...m.card, data: editFields } } : m));
    setEditingCard(null);
    toast({ description: 'Changes saved' });
  };

  const handleConfirmCard = (msgId: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id === msgId && m.card) {
        const newData = { ...m.card.data, status: editingCard === msgId ? editFields.status || 'sent' : 'sent' };
        const successMsg = m.card.type === 'email' ? 'Email sent successfully.' : 'Calendar event confirmed.';
        toast({ description: successMsg });
        return { ...m, content: successMsg, actions: undefined, card: { ...m.card, data: newData } };
      }
      return m;
    }));
    setEditingCard(null);
  };

  return (
    <div className="flex-1 flex h-full min-w-0 bg-background">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        <div className="flex-1 overflow-y-auto custom-scroll px-4 md:px-8 py-8 space-y-8">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-4 w-full max-w-3xl mx-auto ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                <Zap className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
            <div className={`max-w-[85%] space-y-3 ${msg.role === 'user' ? 'order-1' : ''}`}>
              <div className={`px-5 py-3.5 ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm shadow-sm' : 'text-foreground'}`}>
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>

              {msg.actions && (
                <div className="space-y-1.5 pl-0.5">
                  {msg.actions.map((action, i) => {
                    const Icon = getActionIcon(action);
                    return (
                      <div key={i} className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                        <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"><Check className="w-2 h-2 text-primary" /></div>
                        <Icon className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm text-foreground/70">{action}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {msg.card?.type === 'email' && (
                <div className="rounded-xl border border-border/40 bg-card p-4 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /><span className="text-sm font-medium text-primary">Email Draft</span></div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-primary/8 text-primary border border-primary/15">
                      {editingCard === msg.id ? (editFields.status as string) : (msg.card.data.status as string)}
                    </span>
                  </div>
                  {editingCard === msg.id ? (
                    <div className="space-y-2.5">
                      <div><label className="text-xs text-muted-foreground block mb-1">To</label><input value={editFields.to || ''} onChange={e => setEditFields(p => ({ ...p, to: e.target.value }))} className="w-full bg-secondary/40 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/25 transition-colors" /></div>
                      <div><label className="text-xs text-muted-foreground block mb-1">Subject</label><input value={editFields.subject || ''} onChange={e => setEditFields(p => ({ ...p, subject: e.target.value }))} className="w-full bg-secondary/40 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/25 transition-colors" /></div>
                      <div><label className="text-xs text-muted-foreground block mb-1">Body</label><textarea value={editFields.preview || ''} onChange={e => setEditFields(p => ({ ...p, preview: e.target.value }))} className="w-full h-24 bg-secondary/40 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/25 resize-none transition-colors" /></div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm"><span className="text-muted-foreground">To:</span><span className="text-foreground/80">{msg.card.data.to}</span></div>
                      <div className="flex items-center gap-2 text-sm"><span className="text-muted-foreground">Subject:</span><span className="text-foreground/80">{msg.card.data.subject}</span></div>
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line line-clamp-4">{msg.card.data.preview}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-1">
                    {editingCard === msg.id ? (
                      <>
                        <button onClick={() => handleSaveCard(msg.id)} className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 btn-hover">Save</button>
                        <button onClick={() => handleConfirmCard(msg.id)} className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 btn-hover">Send</button>
                        <button onClick={() => setEditingCard(null)} className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => msg.card && handleEditCard(msg.id, msg.card.data)} className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">Edit</button>
                        <button onClick={() => handleConfirmCard(msg.id)} className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 btn-hover">Send</button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {msg.card?.type === 'calendar' && (
                <div className="rounded-xl border border-border/40 bg-card p-4 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-foreground/60" /><span className="text-sm font-medium text-foreground/70">Calendar Event</span></div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-primary/8 text-primary border border-primary/15">
                      {editingCard === msg.id ? (editFields.status as string) : (msg.card.data.status as string)}
                    </span>
                  </div>
                  {editingCard === msg.id ? (
                    <div className="space-y-2.5">
                      <div><label className="text-xs text-muted-foreground block mb-1">Title</label><input value={editFields.title || ''} onChange={e => setEditFields(p => ({ ...p, title: e.target.value }))} className="w-full bg-secondary/40 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/25 transition-colors" /></div>
                      <div><label className="text-xs text-muted-foreground block mb-1">Date</label><input value={editFields.date || ''} onChange={e => setEditFields(p => ({ ...p, date: e.target.value }))} className="w-full bg-secondary/40 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/25 transition-colors" /></div>
                      <div><label className="text-xs text-muted-foreground block mb-1">Time</label><input value={editFields.time || ''} onChange={e => setEditFields(p => ({ ...p, time: e.target.value }))} className="w-full bg-secondary/40 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/25 transition-colors" /></div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">{msg.card.data.title}</div>
                      <div className="flex items-center gap-2 text-sm"><Clock className="w-3.5 h-3.5 text-muted-foreground" /><span className="text-foreground/70">{msg.card.data.date}, {msg.card.data.time}</span></div>
                      <div className="flex items-center gap-2 text-sm"><Users className="w-3.5 h-3.5 text-muted-foreground" /><span className="text-foreground/70">{msg.card.data.attendees} attendees</span></div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-1">
                    {editingCard === msg.id ? (
                      <>
                        <button onClick={() => handleSaveCard(msg.id)} className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 btn-hover">Save</button>
                        <button onClick={() => handleConfirmCard(msg.id)} className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 btn-hover">Confirm</button>
                        <button onClick={() => setEditingCard(null)} className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => msg.card && handleEditCard(msg.id, msg.card.data)} className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">Edit</button>
                        <button onClick={() => handleConfirmCard(msg.id)} className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 btn-hover">Confirm</button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex gap-4 w-full max-w-3xl mx-auto">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex items-center gap-2 px-2 py-3">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length <= 2 && (
        <div className="w-full max-w-3xl mx-auto px-4 pb-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestedActions.map(a => (
              <button key={a.label} onClick={() => handleSubmit(a.label)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-secondary/60 border border-border/40 text-sm text-foreground/80 hover:bg-secondary hover:border-border/60 transition-all hover:scale-[1.02]">
                {a.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="w-full max-w-3xl mx-auto px-4 pb-6 pt-2">
        <div className="flex flex-col gap-2 relative bg-card border border-border/50 shadow-sm rounded-2xl p-2 focus-within:border-primary/30 focus-within:ring-4 focus-within:ring-primary/10 transition-all">
          <textarea 
            value={input} 
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(input); } }}
            placeholder="Ask Corsair anything..." 
            className="w-full bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground resize-none focus:outline-none min-h-[44px] max-h-48 py-3 px-3 custom-scroll" 
            rows={1}
          />
          <div className="flex items-center justify-between px-1 pb-1">
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground"><Paperclip className="w-4 h-4" /></button>
              <button className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground"><Mic className="w-4 h-4" /></button>
            </div>
            <button onClick={() => handleSubmit(input)} disabled={!input.trim() || isProcessing}
              className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
        <div className="text-center mt-3 text-xs text-muted-foreground/60">
          Corsair can make mistakes. Consider verifying important information.
        </div>
      </div>
      </div>
    </div>
  );
}
