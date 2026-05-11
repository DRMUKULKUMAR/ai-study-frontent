import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { BookMarked, PencilLine, Plus, Save, Trash2 } from "lucide-react";
import { useNotes } from "../hooks/use-notes";
import { Skeleton } from "./ui/skeleton";

export function Notes() {
  const { notes, isLoading, isUsingLocalStore, upsertNote, removeNote } = useNotes();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ title: "", topic: "", content: "" });
  const activeNote = useMemo(
    () => notes.find((note) => note.id === activeId) ?? null,
    [activeId, notes],
  );

  const applyNoteToDraft = (noteId: string | null) => {
    setActiveId(noteId);
    const note = notes.find((item) => item.id === noteId);
    if (!note) {
      setDraft({ title: "", topic: "", content: "" });
      return;
    }
    setDraft({
      title: note.title,
      topic: note.topic ?? "",
      content: note.content,
    });
  };

  const handleSave = async () => {
    await upsertNote({
      id: activeId ?? undefined,
      title: draft.title,
      topic: draft.topic,
      content: draft.content,
    });

    if (!activeId) {
      setDraft({ title: "", topic: "", content: "" });
    }
  };

  return (
    <div className="h-full overflow-auto">
      <div className="mx-auto grid h-full max-w-7xl gap-5 p-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:p-8">
        <section className="rounded-2xl border border-white/25 bg-white/70 p-4 shadow-xl backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookMarked className="h-5 w-5 text-primary" />
              <h2 className="font-[var(--font-display)] text-lg font-semibold text-foreground">Notes</h2>
            </div>
            <button
              onClick={() => applyNoteToDraft(null)}
              className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
              aria-label="Create note"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {isUsingLocalStore && (
            <div className="mb-3 rounded-lg border border-secondary/20 bg-secondary/10 px-3 py-2 text-xs text-secondary-foreground">
              Notes API is unavailable, using secure local persistence.
            </div>
          )}

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          ) : (
            <div className="space-y-2">
              {notes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => applyNoteToDraft(note.id)}
                  className={`w-full rounded-xl border px-3 py-2 text-left transition ${
                    activeId === note.id
                      ? "border-primary/40 bg-primary/10"
                      : "border-border/60 bg-white hover:border-primary/20 hover:bg-muted/30"
                  }`}
                >
                  <p className="truncate text-sm font-medium text-foreground">{note.title}</p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{note.topic || "No topic"}</p>
                </button>
              ))}
              {!notes.length && (
                <p className="rounded-xl border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
                  Create your first study note.
                </p>
              )}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-white/25 bg-white/70 p-5 shadow-xl backdrop-blur-xl">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h1 className="font-[var(--font-display)] text-2xl font-semibold text-foreground">
                {activeNote ? "Edit Note" : "Create Note"}
              </h1>
              <p className="text-sm text-muted-foreground">Capture insights, formulas, and revision pointers.</p>
            </div>
            {activeId && (
              <button
                onClick={() => void removeNote(activeId)}
                className="rounded-xl border border-destructive/30 px-3 py-2 text-destructive transition hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          <motion.div
            key={activeId ?? "new"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <label className="block">
              <span className="mb-1.5 block text-sm text-muted-foreground">Title</span>
              <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-white px-3 py-2.5">
                <PencilLine className="h-4 w-4 text-muted-foreground" />
                <input
                  value={draft.title}
                  onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
                  className="w-full bg-transparent text-sm text-foreground outline-none"
                  placeholder="Example: Integration by parts shortcuts"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm text-muted-foreground">Topic</span>
              <input
                value={draft.topic}
                onChange={(event) => setDraft((prev) => ({ ...prev, topic: event.target.value }))}
                className="w-full rounded-xl border border-border/60 bg-white px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/60"
                placeholder="Algebra, Physics, Organic chemistry..."
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm text-muted-foreground">Content</span>
              <textarea
                rows={12}
                value={draft.content}
                onChange={(event) => setDraft((prev) => ({ ...prev, content: event.target.value }))}
                className="w-full rounded-xl border border-border/60 bg-white px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/60"
                placeholder="Write key takeaways..."
              />
            </label>

            <button
              onClick={() => void handleSave()}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-md transition hover:bg-primary/90"
            >
              <Save className="h-4 w-4" />
              Save note
            </button>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

