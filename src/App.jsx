import React, { useEffect, useState } from "react";
import NoteList from "./components/NoteList";
import Editor from "./components/Editor";
import useSupabaseNotes from "./hooks/useSupabaseNotes";
import "./App.css";

export default function App() {
  const { notes, addNote, updateNote, deleteNote, loading } = useSupabaseNotes();
  const [activeId, setActiveId] = useState(null);
  const [query, setQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    if (!activeId && notes.length) setActiveId(notes[0].id);
  }, [notes, activeId]);

  // ✅ Create a new note
  async function createNote() {
  const newNote = {
    title: "Untitled",
    content: "<p></p>",
    pinned: false,
    encrypted: false,
    iv: null,
    meta: { createdAt: Date.now(), updatedAt: Date.now() },
  };

  try {
    const created = await addNote(newNote); // Supabase will create the UUID
    if (created && created.id) setActiveId(created.id);
  } catch (err) {
    console.error("Error creating note:", err);
    alert("Failed to create note.");
  }
}


  // ✅ Search and sort notes
  const filteredNotes = notes
    .filter((n) => {
      const q = query.toLowerCase();
      return (
        !q ||
        n.title.toLowerCase().includes(q) ||
        (n.content && n.content.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => b.pinned - a.pinned || b.meta.updatedAt - a.meta.updatedAt);

  const activeNote = notes.find((n) => n.id === activeId) || null;

  // ✅ UI
  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      {/* Sidebar */}
      {sidebarVisible && (
        <div className="sidebar card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <h3>Notes</h3>
            <button
              className="top-btn"
              onClick={createNote}
              title="Create a new note"
            >
              ➕
            </button>
          </div>

          <input
            className="search"
            placeholder="Search title or content..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <NoteList
            notes={filteredNotes}
            activeId={activeId}
            setActiveId={setActiveId}
            updateNote={updateNote}
            deleteNote={deleteNote}
          />
        </div>
      )}

      {/* Main Editor */}
      <div className="main card">
        {activeNote ? (
          <Editor
            note={activeNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            darkMode={darkMode}
            toggleDarkMode={() => setDarkMode(!darkMode)}
            toggleSidebar={() => setSidebarVisible(!sidebarVisible)}
          />
        ) : (
          <div style={{ padding: 20 }}>
            No note selected. Create one or choose from the list.
          </div>
        )}
      </div>
    </div>
  );
}
