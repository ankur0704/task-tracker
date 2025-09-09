import { useState, useEffect, useMemo, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

type Note = {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  tags: string[];
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

const STORAGE_KEY = "tt:notes:v1";

const loadNotes = (): Note[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(Boolean) as Note[];
  } catch {
    return [];
  }
};

const saveNotes = (notes: Note[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // ignore write errors
  }
};

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>(() => loadNotes());
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  const filteredSorted = useMemo(() => {
    const q = search.trim().toLowerCase();
    const byQuery = q
      ? notes.filter(n =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.tags.some(t => t.toLowerCase().includes(q))
        )
      : notes;
    return byQuery
      .slice()
      .sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [notes, search]);

  const handleAdd = useCallback(() => {
    if (!title.trim() && !content.trim()) return;
    const now = new Date().toISOString();
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: title.trim() || "Untitled",
      content: content.trim(),
      pinned: false,
      tags: [],
      createdAt: now,
      updatedAt: now,
    };
    setNotes(prev => [newNote, ...prev]);
    setTitle("");
    setContent("");
    toast({ description: "Note added" });
  }, [title, content]);

  const startEdit = useCallback((id: string) => {
    const n = notes.find(n => n.id === id);
    if (!n) return;
    setEditingId(id);
    setEditTitle(n.title);
    setEditContent(n.content);
  }, [notes]);

  const saveEdit = useCallback(() => {
    if (!editingId) return;
    setNotes(prev => prev.map(n => n.id === editingId ? {
      ...n,
      title: editTitle.trim() || "Untitled",
      content: editContent.trim(),
      updatedAt: new Date().toISOString(),
    } : n));
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
    toast({ description: "Note saved" });
  }, [editingId, editTitle, editContent]);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
  }, []);

  const remove = useCallback((id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    toast({ description: "Note deleted" });
  }, []);

  const togglePin = useCallback((id: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned, updatedAt: new Date().toISOString() } : n));
    toast({ description: "Pin status updated" });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container max-w-3xl mx-auto py-8 px-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Notes</h1>
          <p className="text-muted-foreground">Capture quick thoughts and ideas</p>
        </div>

        <Card className="p-4 mb-6 space-y-3">
          <div className="grid gap-2">
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Title"
              onKeyDown={e => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleAdd();
              }}
            />
            <Textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write your note... (Ctrl/Cmd+Enter to add)"
              rows={4}
              onKeyDown={e => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleAdd();
              }}
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{notes.length} total</Badge>
              <Badge variant="secondary">{notes.filter(n => n.pinned).length} pinned</Badge>
            </div>
            <Button onClick={handleAdd}>
              Add Note
            </Button>
          </div>
        </Card>

        <div className="mb-4">
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search notes..."
          />
        </div>

        <div className="space-y-3">
          {filteredSorted.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">No notes yet. Add your first one above.</Card>
          ) : (
            filteredSorted.map(note => (
              <Card key={note.id} className="p-4">
                {editingId === note.id ? (
                  <div className="space-y-2">
                    <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                    <Textarea rows={4} value={editContent} onChange={e => setEditContent(e.target.value)} />
                    <div className="flex gap-2 justify-end">
                      <Button variant="secondary" onClick={cancelEdit}>Cancel</Button>
                      <Button onClick={saveEdit}>Save</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{note.title}</h3>
                        {note.pinned && <Badge>pinned</Badge>}
                      </div>
                      {note.content && (
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{note.content}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" onClick={() => togglePin(note.id)}>{note.pinned ? "Unpin" : "Pin"}</Button>
                      <Button variant="secondary" onClick={() => startEdit(note.id)}>Edit</Button>
                      <Button variant="destructive" onClick={() => remove(note.id)}>Delete</Button>
                    </div>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;