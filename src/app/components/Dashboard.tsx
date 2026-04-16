import { TrendingUp, Brain, Target, Award, ArrowRight, Clock, Search, Plus } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

export function Dashboard() {
  const stats = [
    { icon: Brain, label: "Topics Mastered", value: "24", change: "+3 this week", trend: "up" },
    { icon: Target, label: "Current Streak", value: "12 days", change: "Keep it up!", trend: "up" },
    { icon: Award, label: "Quiz Accuracy", value: "87%", change: "+5% improvement", trend: "up" },
    { icon: Clock, label: "Study Time", value: "8.5h", change: "This week", trend: "neutral" },
  ];

  const weakTopics = [
    { name: "Calculus Integration", score: 45, sessions: 8 },
    { name: "Organic Chemistry", score: 52, sessions: 12 },
    { name: "Classical Mechanics", score: 61, sessions: 6 },
  ];

  const recentActivity = [
    { type: "quiz", topic: "Algebra", score: 92, time: "2 hours ago" },
    { type: "chat", topic: "Physics", time: "5 hours ago" },
    { type: "quiz", topic: "Chemistry", score: 78, time: "Yesterday" },
  ];

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-6 lg:space-y-8">
        {/* Mobile Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search topics, quizzes..."
              className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </div>
        </motion.div>

        {/* Welcome Card - Mobile */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-5 border border-primary/10"
        >
          <h2 className="text-lg font-semibold text-foreground mb-1">Welcome!</h2>
          <p className="text-sm text-muted-foreground">Let's schedule your project</p>
        </motion.div>

        {/* Header - Desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:block"
        >
          <h1 className="font-[var(--font-display)] text-4xl lg:text-5xl font-semibold text-foreground mb-2">
            Welcome back, John
          </h1>
          <p className="text-lg text-muted-foreground">
            You're making great progress. Keep learning!
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, staggerChildren: 0.1 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-card p-4 lg:p-6 rounded-2xl border border-border shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <div className="flex items-start justify-between mb-3 lg:mb-4">
                <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-secondary" />
                </div>
                {stat.trend === "up" && (
                  <TrendingUp className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-accent" />
                )}
              </div>
              <div className="text-2xl lg:text-3xl font-[var(--font-display)] font-semibold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-xs lg:text-sm text-muted-foreground mb-1 line-clamp-1">{stat.label}</div>
              <div className="text-[10px] lg:text-xs text-accent">{stat.change}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Section Header */}
        <div className="flex items-center justify-between lg:hidden">
          <h3 className="text-base font-semibold text-foreground">Ongoing Projects</h3>
          <Link to="/mistakes" className="text-xs text-primary">View all</Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Weak Topics */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-card rounded-2xl border border-border p-5 lg:p-6 shadow-md"
          >
            <div className="flex items-center justify-between mb-5 lg:mb-6">
              <h2 className="font-[var(--font-display)] text-xl lg:text-2xl font-semibold text-foreground">
                Focus Areas
              </h2>
              <Link
                to="/mistakes"
                className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
              >
                View all
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4 lg:space-y-5">
              {weakTopics.map((topic, index) => (
                <motion.div
                  key={topic.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="group p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-primary/10 active:scale-[0.98] transition-transform lg:p-0 lg:bg-transparent lg:border-0"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-sm lg:text-base font-medium text-foreground group-hover:text-primary transition-colors">
                        {topic.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">{topic.sessions} practice sessions</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-base lg:text-sm font-semibold text-foreground">{topic.score}%</div>
                      <div className="text-[10px] lg:text-xs text-muted-foreground">mastery</div>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${topic.score}%` }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-accent to-secondary rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-2xl border border-border p-5 lg:p-6 shadow-md"
          >
            <h2 className="font-[var(--font-display)] text-xl lg:text-2xl font-semibold text-foreground mb-5 lg:mb-6">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activity.type === "quiz" ? "bg-primary/10" : "bg-secondary/10"
                  }`}>
                    {activity.type === "quiz" ? (
                      <Target className="w-4 h-4 text-primary" />
                    ) : (
                      <Brain className="w-4 h-4 text-secondary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.topic}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>{activity.time}</span>
                      {activity.score && (
                        <>
                          <span>•</span>
                          <span className="text-accent font-medium">{activity.score}%</span>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid md:grid-cols-2 gap-3 lg:gap-4"
        >
          <Link
            to="/chat"
            className="group bg-gradient-to-br from-primary to-primary/90 p-5 lg:p-6 rounded-2xl text-white hover:shadow-lg transition-all active:scale-[0.98] shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-[var(--font-display)] text-lg lg:text-xl font-semibold mb-1 lg:mb-2">
                  Start Learning Session
                </h3>
                <p className="text-white/80 text-xs lg:text-sm">
                  Chat with your AI tutor and get personalized help
                </p>
              </div>
              <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" />
            </div>
          </Link>
          <Link
            to="/quiz"
            className="group bg-gradient-to-br from-accent to-accent/90 p-5 lg:p-6 rounded-2xl text-white hover:shadow-lg transition-all active:scale-[0.98] shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-[var(--font-display)] text-lg lg:text-xl font-semibold mb-1 lg:mb-2">
                  Take a Quiz
                </h3>
                <p className="text-white/80 text-xs lg:text-sm">
                  Test your knowledge and track your progress
                </p>
              </div>
              <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" />
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Floating Action Button (FAB) - Mobile Only */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
        className="lg:hidden fixed bottom-20 right-6 z-40"
      >
        <Link
          to="/chat"
          className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg flex items-center justify-center text-white active:scale-95 transition-transform hover:shadow-xl"
        >
          <Plus className="w-6 h-6" />
        </Link>
      </motion.div>
    </div>
  );
}
