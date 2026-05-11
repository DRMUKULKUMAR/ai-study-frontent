import axios, { AxiosError } from "axios";
import { getAuthToken } from "./auth-storage";
import type { ApiEnvelope } from "../types/domain";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function unwrapApi<T>(payload: ApiEnvelope<T>): T {
  return payload.data;
}

export function getApiErrorMessage(error: unknown): string {
  const fallback = "Something went wrong. Please try again.";

  if (!error) {
    return fallback;
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiEnvelope<unknown>>;
    const payload = axiosError.response?.data as
      | (ApiEnvelope<unknown> & { data?: { errors?: Record<string, string[]> } })
      | undefined;

    const firstError = payload?.data?.errors
      ? Object.values(payload.data.errors).flat()[0]
      : null;

    return firstError ?? payload?.message ?? axiosError.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
