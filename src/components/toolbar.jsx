import React from "react";

export default function Toolbar({
  note,
  applyFormat,
  encryptNote,
  decryptNote,
  deleteNote,
  runAI
}) {
  return (
    <div className="toolbar">

      {/* Alignment group */}
      <div className="toolbar-group">
        <button className="format-btn" onClick={() => applyFormat("justifyLeft")} title="Align Left">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="5" width="14" height="2"/>
            <rect x="3" y="10" width="18" height="2"/>
            <rect x="3" y="15" width="14" height="2"/>
            <rect x="3" y="20" width="18" height="2"/>
          </svg>
        </button>
        <button className="format-btn" onClick={() => applyFormat("justifyCenter")} title="Align Center">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <rect x="5" y="5" width="14" height="2"/>
            <rect x="3" y="10" width="18" height="2"/>
            <rect x="5" y="15" width="14" height="2"/>
            <rect x="3" y="20" width="18" height="2"/>
          </svg>
        </button>
        <button className="format-btn" onClick={() => applyFormat("justifyRight")} title="Align Right">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <rect x="7" y="5" width="14" height="2"/>
            <rect x="3" y="10" width="18" height="2"/>
            <rect x="7" y="15" width="14" height="2"/>
            <rect x="3" y="20" width="18" height="2"/>
          </svg>
        </button>
      </div>

      {/* Text formatting */}
      <div className="toolbar-group">
        <button className="format-btn" onClick={() => applyFormat("bold")} title="Bold (Ctrl+B)"><b>B</b></button>
        <button className="format-btn" onClick={() => applyFormat("italic")} title="Italic (Ctrl+I)"><i>I</i></button>
        <button className="format-btn" onClick={() => applyFormat("underline")} title="Underline (Ctrl+U)"><u>U</u></button>
        <button className="format-btn" onClick={() => applyFormat("strikeThrough")} title="Strikethrough">S</button>
      </div>

      {/* Font controls */}
      <div className="toolbar-group">
        <select
          className="format-select"
          onChange={(e) => applyFormat("fontSize", e.target.value)}
          title="Font Size"
          defaultValue={3}
        >
          {[12, 14, 16, 18, 20, 24].map((s) => (
            <option key={s} value={s / 2}>{s}px</option>
          ))}
        </select>

        <div className="format-btn color-btn" title="Text Color">
          A
          <input type="color" onChange={(e) => applyFormat("foreColor", e.target.value)} />
        </div>

        <div className="format-btn color-btn" title="Highlight Color">
          🖌
          <input type="color" onChange={(e) => applyFormat("hiliteColor", e.target.value)} />
        </div>
      </div>

      {/* Security + delete */}
      <div className="toolbar-group">
        {!note.locked ? (
          <button className="format-btn" onClick={encryptNote} title="Encrypt Note">🔒</button>
        ) : (
          <button className="format-btn" onClick={decryptNote} title="Decrypt Note">🔓</button>
        )}
<button
  className="format-btn"
  disabled={note.locked || note.encrypted}
  style={{
    opacity: note.locked || note.encrypted ? 0.5 : 1,
    cursor: note.locked || note.encrypted ? "not-allowed" : "pointer",
  }}
  onClick={() => {
    if (note.locked || note.encrypted) {
      alert("🔒 This note is locked. Please unlock it before deleting.");
      return;
    }
    deleteNote();
  }}
  title="Delete Note"
>
  🗑
</button>

      </div>

      {/* AI Features */}
      <div className="toolbar-group ai-group">
        <button className="ai-btn" onClick={() => runAI("summarize")} title="Generate a quick summary of this note">Summarize</button>
        <button className="ai-btn" onClick={() => runAI("tags")} title="Suggest relevant tags for this note">Tags</button>
        <button className="ai-btn" onClick={() => runAI("grammar")} title="Check grammar issues">Grammar</button>
        <button className="ai-btn" onClick={() => runAI("glossary")} title="Highlight key terms with definitions">Glossary</button>
      </div>
    </div>
  );
}
