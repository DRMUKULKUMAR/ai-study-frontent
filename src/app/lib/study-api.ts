import { apiClient, unwrapApi } from "./api-client";
import type { AuthUser, ChatMessage, MistakeRecord, Topic } from "../types/domain";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface AuthResponseData {
  user: AuthUser;
  token: string;
}

export async function login(payload: LoginPayload): Promise<AuthResponseData> {
  const response = await apiClient.post("/auth/login", payload);
  return unwrapApi(response.data);
}

export async function register(payload: RegisterPayload): Promise<AuthResponseData> {
  const response = await apiClient.post("/auth/register", payload);
  return unwrapApi(response.data);
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const response = await apiClient.get("/auth/me");
  return unwrapApi(response.data);
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
}

export async function fetchTopics(): Promise<Topic[]> {
  const response = await apiClient.get("/topics");
  return unwrapApi(response.data);
}

export async function fetchMistakes(): Promise<MistakeRecord[]> {
  const response = await apiClient.get("/mistakes");
  return unwrapApi(response.data);
}

export async function fetchServerChatHistory(): Promise<ChatMessage[]> {
  const response = await apiClient.get("/chat/messages");
  return unwrapApi(response.data);
}

