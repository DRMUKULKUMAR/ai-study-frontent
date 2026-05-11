import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { BookmarkPlus, LoaderCircle, Send, Sparkles, TrendingDown } from "lucide-react";
import { generateChatReply } from "../lib/ai-client";
import { fetchServerChatHistory } from "../lib/study-api";
import {
  getChatHistory,
  prependHistory,
  pushNotification,
  saveChatHistory,
} from "../lib/local-db";
import { useDashboardData } from "../hooks/use-dashboard-data";
import type { ChatMessage } from "../types/domain";

const greetingMessage: ChatMessage = {
  id: "assistant-greeting",
  role: "assistant",
  content: "Welcome back. Ask anything and I will adapt explanations to your weak topics in real time.",
  timestamp: new Date().toISOString(),
};

export function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { weakTopics } = useDashboardData();

  useEffect(() => {
    const local = getChatHistory();
    setMessages(local.length ? local : [greetingMessage]);

    void (async () => {
      try {
        const serverHistory = await fetchServerChatHistory();
        if (Array.isArray(serverHistory) && serverHistory.length) {
          setMessages(serverHistory);
        }
      } catch {
        // Server chat endpoint is optional.
      }
    })();
  }, []);

  useEffect(() => {
    if (messages.length) {
      saveChatHistory(messages);
    }
  }, [messages]);

  const quickPrompts = useMemo(() => {
    const fromWeakTopics = weakTopics.slice(0, 3).map((topic) => `Explain ${topic.topic} with easy examples`);
    const defaults = ["Give me a 5-minute revision plan", "Test me with one quick question"];
    return [...fromWeakTopics, ...defaults];
  }, [weakTopics]);

  const onSend = async () => {
    if (!message.trim() || isSending) {
      return;
    }

    setError(null);
    const userPrompt = message.trim();
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: userPrompt,
      timestamp: new Date().toISOString(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setMessage("");
    setIsSending(true);

    try {
      const reply = await generateChatReply(nextMessages, userPrompt);
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: reply,
        timestamp: new Date().toISOString(),
      };
      const resolved = [...nextMessages, assistantMessage];
      setMessages(resolved);

      prependHistory({
        id: crypto.randomUUID(),
        type: "chat",
        title: userPrompt.slice(0, 70),
        createdAt: assistantMessage.timestamp,
      });
      pushNotification({
        id: crypto.randomUUID(),
        title: "AI reply ready",
        body: "Your study assistant answered a new question.",
        createdAt: assistantMessage.timestamp,
        read: false,
      });
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Unable to send message right now.");
    } finally {
      setIsSending(false);
    }
  };

  const toggleBookmark = (id: string) => {
    setMessages((current) =>
      current.map((item) =>
        item.id === id ? { ...item, bookmarked: !item.bookmarked } : item,
      ),
    );
  };

  return (
    <div className="h-full">
      <div className="mx-auto grid h-full max-w-7xl gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:p-8">
        <section className="flex min-h-0 flex-col rounded-2xl border border-white/30 bg-white/70 shadow-2xl backdrop-blur-2xl">
          <div className="border-b border-white/20 px-4 py-4 lg:px-6">
            <h1 className="font-[var(--font-display)] text-2xl font-semibold text-foreground lg:text-3xl">AI Study Chat</h1>
            <p className="text-sm text-muted-foreground">Live AI tutoring with context-aware support.</p>
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-auto px-4 py-4 lg:px-6">
            {messages.map((msg, index) => (
              <motion.div
                key={`${msg.id}-${index}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white">
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`max-w-[86%] rounded-2xl border px-4 py-3 text-sm shadow-sm lg:max-w-2xl ${
                    msg.role === "user"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/60 bg-white text-foreground"
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-[11px] opacity-70">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {msg.role === "assistant" && (
                      <button
                        onClick={() => toggleBookmark(msg.id)}
                        className={`rounded-lg px-2 py-1 text-[11px] transition ${
                          msg.bookmarked ? "bg-secondary/15 text-secondary" : "bg-muted/50 text-muted-foreground"
                        }`}
                      >
                        <span className="inline-flex items-center gap-1">
                          <BookmarkPlus className="h-3 w-3" />
                          {msg.bookmarked ? "Bookmarked" : "Bookmark"}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            {isSending && (
              <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-white px-3 py-2 text-sm text-muted-foreground">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Generating answer...
              </div>
            )}
          </div>

          <div className="border-t border-white/20 px-4 py-3 lg:px-6">
            {error && (
              <div className="mb-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="flex gap-2">
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    void onSend();
                  }
                }}
                placeholder="Ask a question, request a summary, or practice concept..."
                className="w-full rounded-xl border border-border/70 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary/60"
              />
              <button
                onClick={() => void onSend()}
                disabled={!message.trim() || isSending}
                className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground shadow-md transition hover:bg-primary/90 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setMessage(prompt)}
                  className="rounded-lg border border-border/60 bg-white px-2.5 py-1.5 text-xs text-foreground transition hover:border-primary/40"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </section>

        <aside className="hidden rounded-2xl border border-white/30 bg-white/70 p-5 shadow-2xl backdrop-blur-2xl lg:block">
          <div className="mb-3 flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-accent" />
            <h2 className="font-[var(--font-display)] text-lg font-semibold text-foreground">Focus Topics</h2>
          </div>
          <div className="space-y-2">
            {weakTopics.length ? (
              weakTopics.map((topic) => (
                <div key={topic.id} className="rounded-xl border border-border/50 bg-white px-3 py-2.5">
                  <p className="text-sm font-medium text-foreground">{topic.topic}</p>
                  <p className="text-xs text-muted-foreground">
                    Accuracy {topic.accuracy}% | Mistakes {topic.mistakes}
                  </p>
                </div>
              ))
            ) : (
              <p className="rounded-xl border border-dashed border-border px-3 py-5 text-sm text-muted-foreground">
                Topic insights will appear after activity sync.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

