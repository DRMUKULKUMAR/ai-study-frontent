import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, Circle, LoaderCircle, RotateCcw, Sparkles } from "lucide-react";
import { fetchTopics } from "../lib/study-api";
import { generateQuiz } from "../lib/ai-client";
import { prependHistory, pushNotification } from "../lib/local-db";
import { usePollingQuery } from "../hooks/use-polling-query";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export function Quiz() {
  const topicQuery = usePollingQuery({
    queryFn: fetchTopics,
    intervalMs: 60000,
  });

  const topics = topicQuery.data ?? [];
  const [selectedTopic, setSelectedTopic] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!selectedTopic && topics.length) {
      setSelectedTopic(topics[0].name);
    }
  }, [selectedTopic, topics]);

  const handleGenerate = async () => {
    if (!selectedTopic) {
      return;
    }
    setIsGenerating(true);
    setGenerationError(null);

    try {
      const generated = await generateQuiz(selectedTopic, 5);
      if (!generated.length) {
        throw new Error("AI did not return usable quiz data. Try again.");
      }
      setQuestions(generated);
      setCurrentQuestion(0);
      setSelectedAnswers([]);
      setShowResults(false);
      pushNotification({
        id: crypto.randomUUID(),
        title: "Quiz generated",
        body: `New ${selectedTopic} quiz is ready.`,
        createdAt: new Date().toISOString(),
        read: false,
      });
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : "Unable to generate quiz.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectAnswer = (answerIndex: number) => {
    const next = [...selectedAnswers];
    next[currentQuestion] = answerIndex;
    setSelectedAnswers(next);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((value) => value + 1);
      return;
    }

    setShowResults(true);
    const score = selectedAnswers.reduce((acc, answer, index) => {
      const question = questions[index];
      return acc + (question && answer === question.correctAnswer ? 1 : 0);
    }, 0);
    const percentage = Math.round((score / Math.max(questions.length, 1)) * 100);
    prependHistory({
      id: crypto.randomUUID(),
      type: "quiz",
      title: `${selectedTopic} quiz completed`,
      score: percentage,
      createdAt: new Date().toISOString(),
    });
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
  };

  const score = useMemo(
    () =>
      selectedAnswers.reduce((acc, answer, index) => {
        const question = questions[index];
        return acc + (question && answer === question.correctAnswer ? 1 : 0);
      }, 0),
    [questions, selectedAnswers],
  );
  const percentage = Math.round((score / Math.max(questions.length, 1)) * 100);
  const progress = questions.length ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  const current = questions[currentQuestion];

  return (
    <div className="h-full overflow-auto">
      <div className="mx-auto max-w-5xl space-y-5 p-4 lg:p-8">
        <section className="rounded-2xl border border-white/30 bg-white/70 p-5 shadow-2xl backdrop-blur-2xl">
          <h1 className="font-[var(--font-display)] text-3xl font-semibold text-foreground lg:text-4xl">Smart Quiz Studio</h1>
          <p className="mt-2 text-sm text-muted-foreground">Generate dynamic quizzes from live topics using AI.</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <select
              value={selectedTopic}
              onChange={(event) => setSelectedTopic(event.target.value)}
              className="w-full rounded-xl border border-border/70 bg-white px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/60"
            >
              {topics.map((topic) => (
                <option key={topic.id} value={topic.name}>
                  {topic.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => void handleGenerate()}
              disabled={!selectedTopic || isGenerating || topicQuery.isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg transition hover:bg-primary/90 disabled:opacity-55"
            >
              {isGenerating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {isGenerating ? "Generating..." : "Generate Quiz"}
            </button>
          </div>
          {generationError && (
            <p className="mt-3 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {generationError}
            </p>
          )}
        </section>

        {showResults ? (
          <motion.section
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-white/30 bg-white/70 p-6 text-center shadow-xl backdrop-blur-xl"
          >
            <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-secondary to-primary text-white">
              <Sparkles className="h-9 w-9" />
            </div>
            <h2 className="font-[var(--font-display)] text-3xl font-semibold text-foreground">Quiz Complete</h2>
            <p className="mt-1 text-sm text-muted-foreground">Topic: {selectedTopic}</p>
            <p className="mt-5 text-5xl font-semibold text-foreground">{percentage}%</p>
            <p className="mt-1 text-sm text-muted-foreground">
              You got {score} out of {questions.length} correct
            </p>
            <button
              onClick={handleRestart}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              <RotateCcw className="h-4 w-4" />
              Try Again
            </button>
          </motion.section>
        ) : current ? (
          <>
            <section className="rounded-2xl border border-white/30 bg-white/70 p-5 shadow-xl backdrop-blur-xl">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Question {currentQuestion + 1} / {questions.length}
                </p>
                <p className="text-sm font-medium text-foreground">{Math.round(progress)}%</p>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                />
              </div>
            </section>

            <section className="rounded-2xl border border-white/30 bg-white/70 p-5 shadow-xl backdrop-blur-xl">
              <h3 className="mb-5 font-[var(--font-display)] text-xl font-semibold text-foreground lg:text-2xl">
                {current.question}
              </h3>
              <div className="space-y-3">
                {current.options.map((option, optionIndex) => (
                  <button
                    key={option}
                    onClick={() => handleSelectAnswer(optionIndex)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left text-sm transition ${
                      selectedAnswers[currentQuestion] === optionIndex
                        ? "border-primary/60 bg-primary/10"
                        : "border-border/60 bg-white hover:border-primary/40"
                    }`}
                  >
                    {selectedAnswers[currentQuestion] === optionIndex ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span>{option}</span>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={selectedAnswers[currentQuestion] === undefined}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-md transition hover:bg-primary/90 disabled:opacity-50"
                >
                  {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </section>
          </>
        ) : (
          <section className="rounded-2xl border border-dashed border-border bg-white/70 px-4 py-12 text-center text-sm text-muted-foreground">
            Select a topic and generate your first AI quiz.
          </section>
        )}
      </div>
    </div>
  );
}

