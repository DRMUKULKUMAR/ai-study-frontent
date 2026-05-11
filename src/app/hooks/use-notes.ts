import { useCallback, useEffect, useMemo, useState } from "react";
import { apiClient } from "../lib/api-client";
import { getNotes, prependHistory, saveNotes } from "../lib/local-db";
import type { StudyNote } from "../types/domain";

function normalizeServerNote(note: Record<string, unknown>): StudyNote {
  return {
    id: String(note.id ?? crypto.randomUUID()),
    title: String(note.title ?? "Untitled"),
    content: String(note.content ?? ""),
    topic: typeof note.topic === "string" ? note.topic : undefined,
    updatedAt: String(note.updated_at ?? new Date().toISOString()),
  };
}

export function useNotes() {
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingLocalStore, setIsUsingLocalStore] = useState(false);

  const hydrate = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get("/notes");
      const payload = response.data?.data;
      if (Array.isArray(payload)) {
        setNotes(payload.map((item: Record<string, unknown>) => normalizeServerNote(item)));
        setIsUsingLocalStore(false);
      } else {
        throw new Error("Invalid notes response.");
      }
    } catch {
      setNotes(getNotes());
      setIsUsingLocalStore(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const upsertNote = useCallback(
    async (input: { id?: string; title: string; content: string; topic?: string }) => {
      const nextNote: StudyNote = {
        id: input.id ?? crypto.randomUUID(),
        title: input.title.trim() || "Untitled",
        content: input.content,
        topic: input.topic?.trim() || undefined,
        updatedAt: new Date().toISOString(),
      };

      const next = [nextNote, ...notes.filter((note) => note.id !== nextNote.id)];
      setNotes(next);
      saveNotes(next);
      prependHistory({
        id: crypto.randomUUID(),
        type: "note",
        title: `Updated note: ${nextNote.title}`,
        createdAt: nextNote.updatedAt,
      });

      if (!isUsingLocalStore) {
        try {
          if (input.id) {
            await apiClient.patch(`/notes/${input.id}`, nextNote);
          } else {
            await apiClient.post("/notes", nextNote);
          }
        } catch {
          setIsUsingLocalStore(true);
        }
      }
    },
    [isUsingLocalStore, notes],
  );

  const removeNote = useCallback(
    async (id: string) => {
      const next = notes.filter((note) => note.id !== id);
      setNotes(next);
      saveNotes(next);
      if (!isUsingLocalStore) {
        try {
          await apiClient.delete(`/notes/${id}`);
        } catch {
          setIsUsingLocalStore(true);
        }
      }
    },
    [isUsingLocalStore, notes],
  );

  return useMemo(
    () => ({
      notes,
      isLoading,
      error,
      isUsingLocalStore,
      upsertNote,
      removeNote,
      refetch: hydrate,
    }),
    [error, hydrate, isLoading, isUsingLocalStore, notes, removeNote, upsertNote],
  );
}

