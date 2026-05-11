import type {
  ChatMessage,
  NotificationItem,
  StudyHistoryItem,
  StudyNote,
} from "../types/domain";

const keys = {
  notes: "ai-study-notes",
  history: "ai-study-history",
  chat: "ai-study-chat-history",
  notifications: "ai-study-notifications",
} as const;

function readJson<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getNotes(): StudyNote[] {
  return readJson(keys.notes, []);
}

export function saveNotes(notes: StudyNote[]) {
  writeJson(keys.notes, notes);
}

export function getHistory(): StudyHistoryItem[] {
  return readJson(keys.history, []);
}

export function saveHistory(history: StudyHistoryItem[]) {
  writeJson(keys.history, history);
}

export function prependHistory(item: StudyHistoryItem) {
  const next = [item, ...getHistory()].slice(0, 100);
  saveHistory(next);
}

export function getChatHistory(): ChatMessage[] {
  return readJson(keys.chat, []);
}

export function saveChatHistory(history: ChatMessage[]) {
  writeJson(keys.chat, history.slice(-100));
}

export function getNotifications(): NotificationItem[] {
  return readJson(keys.notifications, []);
}

export function saveNotifications(items: NotificationItem[]) {
  writeJson(keys.notifications, items.slice(0, 100));
}

export function pushNotification(item: NotificationItem) {
  saveNotifications([item, ...getNotifications()]);
}

