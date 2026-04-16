import { TrendingDown, TrendingUp, Target, AlertCircle, BookOpen, Calendar } from "lucide-react";
import { motion } from "motion/react";

export function MistakeAnalysis() {
  const mistakesByTopic = [
    {
      topic: "Calculus Integration",
      totalAttempts: 45,
      mistakes: 25,
      recentTrend: "improving",
      lastPracticed: "2 days ago",
      commonErrors: [
        "Forgetting the constant of integration",
        "Incorrect application of substitution rule",
        "Sign errors in integration by parts",
      ],
    },
    {
      topic: "Organic Chemistry",
      totalAttempts: 38,
      mistakes: 18,
      recentTrend: "improving",
      lastPracticed: "1 day ago",
      commonErrors: [
        "Stereochemistry configuration errors",
        "Reaction mechanism steps",
        "Functional group identification",
      ],
    },
    {
      topic: "Classical Mechanics",
      totalAttempts: 32,
      mistakes: 12,
      recentTrend: "stable",
      lastPracticed: "3 days ago",
      commonErrors: [
        "Free body diagram setup",
        "Conservation of energy application",
        "Vector component calculations",
      ],
    },
    {
      topic: "Linear Algebra",
      totalAttempts: 28,
      mistakes: 8,
      recentTrend: "improving",
      lastPracticed: "5 days ago",
      commonErrors: [
        "Matrix multiplication order",
        "Eigenvalue calculation steps",
        "Vector space properties",
      ],
    },
  ];

  const weeklyProgress = [
    { week: "Week 1", errors: 42 },
    { week: "Week 2", errors: 38 },
    { week: "Week 3", errors: 31 },
    { week: "Week 4", errors: 25 },
  ];

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-6 lg:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-[var(--font-display)] text-3xl lg:text-5xl font-semibold text-foreground mb-2">
            Mistake Analysis
          </h1>
          <p className="text-sm lg:text-lg text-muted-foreground">
            Learn from your errors and track improvement over time
          </p>
        </motion.div>

        {/* Weekly Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border border-border p-5 lg:p-6 shadow-md"
        >
          <div className="flex items-start lg:items-center justify-between mb-5 lg:mb-6 gap-3">
            <div className="flex-1">
              <h2 className="font-[var(--font-display)] text-xl lg:text-2xl font-semibold text-foreground mb-1">
                Weekly Error Trend
              </h2>
              <p className="text-xs lg:text-sm text-muted-foreground">You're making fewer mistakes each week!</p>
            </div>
            <div className="flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3 py-1.5 bg-accent/10 rounded-lg flex-shrink-0">
              <TrendingUp className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-accent" />
              <span className="text-xs lg:text-sm font-medium text-accent whitespace-nowrap">40% up</span>
            </div>
          </div>
          <div className="flex items-end gap-4 h-48">
            {weeklyProgress.map((week, index) => {
              const maxErrors = Math.max(...weeklyProgress.map((w) => w.errors));
              const height = (week.errors / maxErrors) * 100;
              return (
                <motion.div
                  key={week.week}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  className="flex-1 relative group"
                >
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-accent to-secondary rounded-t-lg opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-foreground text-background px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
                      {week.errors} errors
                    </div>
                  </div>
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">
                    {week.week}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Mistakes by Topic */}
        <div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="font-[var(--font-display)] text-xl lg:text-2xl font-semibold text-foreground mb-4"
          >
            Breakdown by Topic
          </motion.h2>
          <div className="space-y-3 lg:space-y-4">
            {mistakesByTopic.map((item, index) => (
              <motion.div
                key={item.topic}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-card rounded-2xl border border-border p-5 lg:p-6 shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-[var(--font-display)] text-xl font-semibold text-foreground">
                        {item.topic}
                      </h3>
                      {item.recentTrend === "improving" && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-accent/10 rounded-full">
                          <TrendingUp className="w-3 h-3 text-accent" />
                          <span className="text-xs font-medium text-accent">Improving</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        <span>{item.totalAttempts} attempts</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Last practiced {item.lastPracticed}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-[var(--font-display)] font-semibold text-foreground mb-1">
                      {item.mistakes}
                    </div>
                    <div className="text-sm text-muted-foreground">mistakes</div>
                  </div>
                </div>

                {/* Accuracy Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Accuracy Rate</span>
                    <span className="font-medium text-foreground">
                      {Math.round(((item.totalAttempts - item.mistakes) / item.totalAttempts) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${((item.totalAttempts - item.mistakes) / item.totalAttempts) * 100}%`,
                      }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-secondary to-primary rounded-full"
                    />
                  </div>
                </div>

                {/* Common Errors */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-muted-foreground" />
                    <h4 className="text-sm font-medium text-foreground">Common Errors</h4>
                  </div>
                  <ul className="space-y-2">
                    {item.commonErrors.map((error, errorIndex) => (
                      <motion.li
                        key={errorIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 + errorIndex * 0.05 }}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                        <span>{error}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="mt-4 w-full px-4 py-2.5 bg-primary/5 hover:bg-primary/10 text-primary rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <BookOpen className="w-4 h-4" />
                  Practice this topic
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Insights Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-2xl border border-primary/20 p-5 lg:p-6"
        >
          <div className="flex items-start gap-3 lg:gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-white/80 flex items-center justify-center flex-shrink-0">
              <TrendingDown className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-[var(--font-display)] text-lg lg:text-xl font-semibold text-foreground mb-2">
                Keep up the great work!
              </h3>
              <p className="text-sm lg:text-base text-muted-foreground mb-4">
                Your error rate has decreased by 40% over the past month. Focus on integration techniques
                and organic chemistry to see even better results.
              </p>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all active:scale-95 text-sm lg:text-base shadow-md">
                View Study Plan
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
