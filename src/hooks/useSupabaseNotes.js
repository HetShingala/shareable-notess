import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

const TABLE = "notes";

export default function useSupabaseNotes(userId = "guest") {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Load notes from Supabase ---
  useEffect(() => {
    async function fetchNotes() {
      setLoading(true);
      const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("❌ Fetch notes error:", error);
      } else {
        setNotes(data || []);
      }
      setLoading(false);
    }

    fetchNotes();
  }, [userId]);

  // --- Add new note ---
  async function addNote(note) {
  try {
    // ❌ Don't pass an `id` – Supabase auto-generates UUID
    const newNote = {
      title: note.title || "Untitled",
      content: note.content || "<p></p>",
      pinned: note.pinned || false,
      encrypted: note.encrypted || false,
      iv: note.iv || null,
      meta: note.meta || { createdAt: Date.now(), updatedAt: Date.now() },
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log("🟢 Adding note:", newNote);

    const { data, error } = await supabase
      .from(TABLE)
      .insert([newNote])
      .select()
      .single(); // ✅ ensures only one object returned instead of array

    if (error) {
      console.error("❌ Add note error:", error);
      alert("Add note failed: " + error.message);
      return null;
    }

    console.log("✅ Supabase insert result:", data);
    setNotes((prev) => [data, ...prev]);
    return data; // ✅ return note to select it immediately
  } catch (err) {
    console.error("🔥 Unexpected error:", err);
    alert("Unexpected error: " + err.message);
    return null;
  }
}


  // --- Update note ---
  async function updateNote(id, updates) {
    const { data, error } = await supabase
      .from(TABLE)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select();

    if (error) console.error("Update note error:", error);
    else
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, ...data[0] } : n))
      );
  }

  // --- Delete note ---
  async function deleteNote(id) {
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) console.error("Delete note error:", error);
    else setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  return { notes, addNote, updateNote, deleteNote, loading };
}
