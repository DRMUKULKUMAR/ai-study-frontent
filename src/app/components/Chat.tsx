import { useState } from "react";
import { Send, Sparkles, TrendingDown, Lightbulb, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

export function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi John! I'm your AI learning assistant. What would you like to learn about today?",
      timestamp: "10:30 AM",
    },
    {
      role: "user",
      content: "Can you help me understand integration by parts?",
      timestamp: "10:31 AM",
    },
    {
      role: "assistant",
      content: "Of course! Integration by parts is a technique used to integrate products of functions. It's based on the product rule for differentiation. The formula is:\n\n∫u dv = uv - ∫v du\n\nWould you like me to walk through an example?",
      timestamp: "10:31 AM",
    },
    {
      role: "user",
      content: "Yes please! Can you show me how to solve ∫x·e^x dx?",
      timestamp: "10:32 AM",
    },
  ]);

  const weakTopics = [
    { name: "Calculus Integration", confidence: 45 },
    { name: "Organic Chemistry", confidence: 52 },
    { name: "Classical Mechanics", confidence: 61 },
  ];

  const suggestions = [
    "Explain the chain rule",
    "Quiz me on derivatives",
    "Show me examples of limits",
  ];

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages([...messages, { role: "user", content: message, timestamp: "Now" }]);
    setMessage("");
  };

  return (
    <div className="h-full flex">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header - Desktop Only */}
        <div className="hidden lg:flex h-16 border-b border-border bg-card px-6 items-center justify-between">
          <div>
            <h2 className="font-[var(--font-display)] text-xl font-semibold text-foreground">
              Learning Session
            </h2>
            <p className="text-sm text-muted-foreground">Ask me anything about your studies</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto px-4 lg:px-6 py-4 lg:py-6 space-y-4 lg:space-y-6">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex gap-2 lg:gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[85%] lg:max-w-2xl ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-card border border-border shadow-sm"
                } rounded-2xl px-4 lg:px-5 py-2.5 lg:py-3`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <p className={`text-[10px] lg:text-xs mt-1.5 lg:mt-2 ${msg.role === "user" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                  {msg.timestamp}
                </p>
              </div>
              {msg.role === "user" && (
                <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center flex-shrink-0 text-white font-semibold text-xs lg:text-sm">
                  JS
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Input Area */}
        <div className="border-t border-border bg-card p-3 lg:p-4 shadow-lg">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask a question..."
                className="flex-1 px-4 py-2.5 lg:py-3 bg-input-background border border-border rounded-xl lg:rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm text-foreground placeholder:text-muted-foreground"
              />
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className="w-10 h-10 lg:w-auto lg:px-5 bg-primary text-primary-foreground rounded-xl lg:rounded-2xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2 mt-2 lg:mt-3 flex-wrap">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setMessage(suggestion)}
                  className="px-3 py-1.5 text-xs bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors active:scale-95"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Context Panel - Hidden on mobile */}
      <motion.aside
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="hidden lg:block w-80 border-l border-border bg-card overflow-auto"
      >
        <div className="p-6 space-y-6">
          {/* Weak Topics */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="w-5 h-5 text-accent" />
              <h3 className="font-[var(--font-display)] text-lg font-semibold text-foreground">
                Focus Areas
              </h3>
            </div>
            <div className="space-y-3">
              {weakTopics.map((topic, index) => (
                <motion.div
                  key={topic.name}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="p-3 bg-background rounded-lg border border-border hover:border-accent/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-foreground">{topic.name}</p>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent to-secondary rounded-full"
                        style={{ width: `${topic.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{topic.confidence}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-secondary" />
              <h3 className="font-[var(--font-display)] text-lg font-semibold text-foreground">
                Suggested Topics
              </h3>
            </div>
            <div className="space-y-2">
              {[
                "Review integration techniques",
                "Practice chemistry equations",
                "Study Newton's laws",
                "Explore trigonometry",
              ].map((suggestion, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="w-full text-left p-3 bg-background rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-sm text-foreground"
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Study Streak */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="p-4 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-xl border border-secondary/20"
          >
            <p className="text-sm text-muted-foreground mb-1">Current Streak</p>
            <p className="font-[var(--font-display)] text-3xl font-semibold text-foreground mb-1">
              12 days
            </p>
            <p className="text-xs text-accent">Keep it up! 🔥</p>
          </motion.div>
        </div>
      </motion.aside>
    </div>
  );
}
