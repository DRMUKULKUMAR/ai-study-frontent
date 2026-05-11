import type { ChatMessage } from "../types/domain";
import { apiClient } from "./api-client";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL ?? "gemini-1.5-flash";
const OPENAI_MODEL = import.meta.env.VITE_OPENAI_MODEL ?? "gpt-4o-mini";

const openAiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
const geminiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

function assertAiConfigured() {
  if (!openAiKey && !geminiKey) {
    throw new Error(
      "AI provider is not configured. Set backend OPENAI_API_KEY or frontend VITE_* AI keys.",
    );
  }
}

function extractAssistantReply(content: string | undefined) {
  if (!content) {
    throw new Error("AI service returned an empty response.");
  }
  return content.trim();
}

export async function generateChatReply(history: ChatMessage[], prompt: string) {
  try {
    const context = history
      .slice(-6)
      .map((item) => `${item.role.toUpperCase()}: ${item.content}`)
      .join("\n");
    const response = await apiClient.post("/ai/notes", {
      content: `Context:\n${context}\n\nUser question:\n${prompt}\n\nReturn a clear tutor response.`,
    });
    const payload = response?.data?.data;
    const summary = typeof payload?.summary === "string" ? payload.summary : "";
    const keyPoints = Array.isArray(payload?.key_points)
      ? payload.key_points.filter((item: unknown) => typeof item === "string").slice(0, 4)
      : [];
    const merged = [summary, ...keyPoints].filter(Boolean).join("\n\n");
    if (merged.trim()) {
      return merged.trim();
    }
  } catch {
    // Fall through to direct provider call.
  }

  assertAiConfigured();

  if (geminiKey) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a concise, friendly AI study tutor. Previous messages:\n${history
                    .slice(-8)
                    .map((message) => `${message.role}: ${message.content}`)
                    .join("\n")}\n\nUser: ${prompt}`,
                },
              ],
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Gemini request failed.");
    }

    const payload = await response.json();
    const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
    return extractAssistantReply(text);
  }

  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openAiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a premium AI tutor. Explain clearly, use short examples, and adapt to student context.",
        },
        ...history.slice(-8).map((message) => ({
          role: message.role,
          content: message.content,
        })),
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
    }),
  });

  if (!response.ok) {
    throw new Error("OpenAI request failed.");
  }

  const payload = await response.json();
  const text = payload?.choices?.[0]?.message?.content;
  return extractAssistantReply(text);
}

interface GeneratedQuiz {
  question: string;
  options: string[];
  correctAnswer: number;
}

function sanitizeQuizPayload(raw: unknown): GeneratedQuiz[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((item) => {
      const question = typeof item?.question === "string" ? item.question : "";
      const options = Array.isArray(item?.options)
        ? item.options.filter((option) => typeof option === "string").slice(0, 4)
        : [];
      const correctAnswer = Number(item?.correctAnswer);

      if (!question || options.length !== 4 || Number.isNaN(correctAnswer)) {
        return null;
      }

      return {
        question,
        options,
        correctAnswer: Math.max(0, Math.min(3, correctAnswer)),
      };
    })
    .filter(Boolean) as GeneratedQuiz[];
}

function extractJsonArray(text: string): unknown {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end === -1) {
    return [];
  }

  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return [];
  }
}

export async function generateQuiz(topic: string, questionCount = 5): Promise<GeneratedQuiz[]> {
  try {
    const response = await apiClient.post("/ai/quiz", {
      topic,
      difficulty: "medium",
    });
    const questions = response?.data?.data?.questions;
    if (Array.isArray(questions) && questions.length) {
      const mapped = questions
        .map((question: Record<string, unknown>) => {
          const prompt = typeof question?.question === "string" ? question.question : "";
          const options = Array.isArray(question?.options)
            ? question.options.filter((item) => typeof item === "string").slice(0, 4)
            : [];
          const answer = typeof question?.answer === "string" ? question.answer : "";
          const correctAnswer = options.findIndex((option) => option === answer);

          if (!prompt || options.length !== 4 || correctAnswer < 0) {
            return null;
          }

          return {
            question: prompt,
            options,
            correctAnswer,
          };
        })
        .filter(Boolean) as GeneratedQuiz[];

      if (mapped.length) {
        return mapped.slice(0, questionCount);
      }
    }
  } catch {
    // Fall through to direct provider call.
  }

  assertAiConfigured();

  const prompt = `Create ${questionCount} multiple-choice quiz questions for "${topic}". Return only valid JSON array with objects: question, options (exactly 4), correctAnswer (0-3).`;

  if (geminiKey) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Gemini quiz generation failed.");
    }

    const payload = await response.json();
    const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    return sanitizeQuizPayload(extractJsonArray(text));
  }

  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openAiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error("OpenAI quiz generation failed.");
  }

  const payload = await response.json();
  const text = payload?.choices?.[0]?.message?.content ?? "";
  return sanitizeQuizPayload(extractJsonArray(text));
}
