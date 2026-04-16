import { useState } from "react";
import { CheckCircle2, Circle, ArrowRight, RotateCcw, Award } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      question: "What is the derivative of f(x) = x² + 3x + 2?",
      options: ["2x + 3", "x² + 3", "2x + 2", "x + 3"],
      correctAnswer: 0,
    },
    {
      question: "Which element has the atomic number 6?",
      options: ["Oxygen", "Carbon", "Nitrogen", "Hydrogen"],
      correctAnswer: 1,
    },
    {
      question: "What is Newton's Second Law of Motion?",
      options: ["F = ma", "E = mc²", "v = u + at", "P = mv"],
      correctAnswer: 0,
    },
    {
      question: "What is the limit of (sin x)/x as x approaches 0?",
      options: ["0", "1", "∞", "undefined"],
      correctAnswer: 1,
    },
  ];

  const handleSelectAnswer = (index: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = index;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
  };

  const score = selectedAnswers.reduce((acc, answer, index) => {
    return acc + (answer === questions[index].correctAnswer ? 1 : 0);
  }, 0);

  const percentage = Math.round((score / questions.length) * 100);

  if (showResults) {
    return (
      <div className="h-full flex items-center justify-center p-4 lg:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-card rounded-2xl border border-border p-6 lg:p-8 shadow-lg text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center mx-auto mb-6"
          >
            <Award className="w-12 h-12 text-white" />
          </motion.div>
          <h2 className="font-[var(--font-display)] text-4xl font-semibold text-foreground mb-2">
            Quiz Complete!
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Here's how you performed
          </p>
          <div className="bg-background rounded-xl p-6 mb-8">
            <div className="text-6xl font-[var(--font-display)] font-bold text-foreground mb-2">
              {percentage}%
            </div>
            <p className="text-muted-foreground mb-4">
              You got {score} out of {questions.length} questions correct
            </p>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-accent to-secondary rounded-full"
              />
            </div>
          </div>
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="w-5 h-5" />
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-4xl mx-auto p-4 lg:p-8">
        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 lg:mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </p>
            <p className="text-sm font-medium text-foreground">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
            </p>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
            />
          </div>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-2xl border border-border p-5 lg:p-8 shadow-lg mb-4 lg:mb-6"
          >
            <h2 className="font-[var(--font-display)] text-xl lg:text-3xl font-semibold text-foreground mb-6 lg:mb-8">
              {question.question}
            </h2>

            <div className="space-y-2.5 lg:space-y-3">
              {question.options.map((option, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleSelectAnswer(index)}
                  className={`w-full p-3.5 lg:p-4 rounded-xl lg:rounded-2xl border-2 transition-all text-left flex items-center gap-3 active:scale-[0.98] ${
                    selectedAnswers[currentQuestion] === index
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-border hover:border-primary/50 hover:bg-accent/5"
                  }`}
                >
                  {selectedAnswers[currentQuestion] === index ? (
                    <CheckCircle2 className="w-5 h-5 lg:w-6 lg:h-6 text-primary flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 lg:w-6 lg:h-6 text-muted-foreground flex-shrink-0" />
                  )}
                  <span className="text-sm lg:text-base text-foreground">{option}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-end"
        >
          <button
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestion] === undefined}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next Question"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
