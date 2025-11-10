import React from "react";
import "./NoteList.css";

export default function NoteList({ notes, activeId, setActiveId, updateNote, deleteNote }) {
  return (
    <div>
      {notes.map((note) => (
        <div
          key={note.id}
          className={"note-row " + (note.id === activeId ? "active" : "")}
          onClick={() => setActiveId(note.id)}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                {note.locked && <span>🔒</span>}
                {note.title || "Untitled"}
              </div>
              <div style={{ fontSize: 12, color: "#666" }}>
                {new Date(note.meta.createdAt).toLocaleString()}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                title="Pin"
                onClick={(e) => {
                  e.stopPropagation();
                  updateNote(note.id, { pinned: !note.pinned });
                }}
              >
                {note.pinned ? "📌" : "📍"}
              </button>
              <button
  title="Delete"
  onClick={(e) => {
    e.stopPropagation();

    // 🔒 Prevent deletion of locked/encrypted notes
    if (note.locked || note.encrypted) {
      alert("🔒 This note is locked. Please unlock it before deleting.");
      return;
    }

    // 🗑 Confirm deletion for unlocked notes
    if (confirm("Delete note?")) {
      deleteNote(note.id);
    }
  }}
  style={{
    opacity: note.locked || note.encrypted ? 0.5 : 1,
    cursor: note.locked || note.encrypted ? "not-allowed" : "pointer",
  }}
>
  🗑
</button>

            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
