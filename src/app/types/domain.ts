export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export interface Topic {
  id: number;
  subject_id?: number;
  name: string;
  questions_count?: number;
  subject?: {
    id: number;
    name: string;
  };
}

export interface MistakeRecord {
  id?: number;
  topic_id?: number;
  topic_name?: string;
  created_at?: string;
  is_correct?: boolean;
  confidence?: number;
  score?: number;
  total_attempts?: number;
  total_mistakes?: number;
  topic?: {
    id?: number;
    name?: string;
  };
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  topic?: string;
  bookmarked?: boolean;
}

export interface StudyNote {
  id: string;
  title: string;
  content: string;
  topic?: string;
  updatedAt: string;
}

export interface StudyHistoryItem {
  id: string;
  type: "chat" | "quiz" | "note";
  title: string;
  score?: number;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export interface TopicInsight {
  id: number;
  topic: string;
  attempts: number;
  mistakes: number;
  accuracy: number;
  confidence: number;
  recentTrend: "improving" | "stable" | "declining";
}

