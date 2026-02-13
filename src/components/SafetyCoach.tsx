import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/stores/gameStore';
import { streamCoachChat, type CoachMessage } from '@/lib/safetyCoachStream';

const QUICK_ACTIONS = [
  { label: '💡 Safety tip', message: 'Give me a quick safety tip I can use today.' },
  { label: '📖 Explain my rights', message: 'Explain my legal rights as a woman in India — what laws protect me?' },
  { label: '🎯 What should I learn next?', message: 'Based on my progress, what should I learn or practice next?' },
  { label: '🔄 Review my last scenario', message: 'Can you review my last scenario performance and give me feedback?' },
];

const SafetyCoach = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { level, confidenceScore, completedScenarios, badges, knowledgeModulesRead } = useGameStore();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Listen for "Talk to Diya" events from other pages
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.message) {
        setIsOpen(true);
        // Small delay to let the panel open before sending
        setTimeout(() => sendMessage(detail.message), 300);
      } else {
        setIsOpen(true);
      }
    };
    window.addEventListener('open-safety-coach', handler);
    return () => window.removeEventListener('open-safety-coach', handler);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMsg: CoachMessage = { role: 'user', content: content.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    let assistantSoFar = '';
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: 'assistant', content: assistantSoFar }];
      });
    };

    await streamCoachChat({
      messages: newMessages,
      playerContext: {
        level,
        confidenceScore,
        completedScenarios,
        badges: badges.map((b) => ({ name: b.name })),
        knowledgeModulesRead,
      },
      onDelta: upsertAssistant,
      onDone: () => setIsLoading(false),
      onError: () => setIsLoading(false),
    });
  }, [messages, isLoading, level, confidenceScore, completedScenarios, badges, knowledgeModulesRead]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-hero shadow-glow transition-transform hover:scale-110"
            aria-label="Talk to Diya, your AI Safety Coach"
          >
            <span className="text-2xl">🪔</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 flex h-[520px] w-[380px] max-w-[calc(100vw-3rem)] flex-col rounded-2xl border border-border bg-card shadow-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between rounded-t-2xl bg-gradient-hero px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🪔</span>
                <div>
                  <p className="text-sm font-bold text-primary-foreground">Diya</p>
                  <p className="text-[10px] text-primary-foreground/70">AI Safety Coach</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                aria-label="Close coach"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center px-2">
                  <Sparkles className="h-8 w-8 text-primary mb-3" />
                  <p className="text-sm font-semibold text-foreground mb-1">Hi! I'm Diya 🪔</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Your AI Safety Coach. Ask me anything about safety, your rights, or get personalized guidance.
                  </p>
                  <div className="grid grid-cols-2 gap-2 w-full">
                    {QUICK_ACTIONS.map((action) => (
                      <button
                        key={action.label}
                        onClick={() => sendMessage(action.message)}
                        className="rounded-lg border border-border bg-background px-2.5 py-2 text-[11px] text-foreground hover:border-primary/40 hover:shadow-glow transition-all text-left"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted text-foreground rounded-bl-md'
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                  </div>
                </div>
              ))}

              {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick actions when conversation is active */}
            {messages.length > 0 && !isLoading && (
              <div className="flex gap-1.5 overflow-x-auto px-4 pb-2 scrollbar-hide">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => sendMessage(action.message)}
                    className="whitespace-nowrap rounded-full border border-border bg-background px-2.5 py-1 text-[10px] text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors shrink-0"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border px-3 py-2.5">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Diya anything..."
                disabled={isLoading}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none disabled:opacity-50"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading}
                className="h-8 w-8 rounded-full bg-gradient-hero"
              >
                <Send className="h-3.5 w-3.5 text-primary-foreground" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SafetyCoach;
