import React, { useState, useRef, useEffect } from "react";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";
import CryptoJS from "crypto-js";
import Toolbar from "./toolbar";
import "./Editor.css";
import {
  summarize,
  suggestTags,
  glossaryTerms,
  grammarCheck,
} from "../services/aiService";

// --- Encryption helpers ---
function encryptText(text, password) {
  return CryptoJS.AES.encrypt(text, password).toString();
}
function decryptText(encrypted, password) {
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, password);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    if (!originalText) throw new Error("Wrong password");
    return originalText;
  } catch {
    throw new Error("Failed to decrypt");
  }
}

export default function Editor({
  note,
  updateNote,
  deleteNote,
  darkMode,
  toggleDarkMode,
  toggleSidebar,
}) {
  const editorRef = useRef(null);
  const [wordCount, setWordCount] = useState({ words: 0, chars: 0 });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const saveTimeout = useRef(null);
const [aiResult, setAiResult] = useState("");

  // --- Update content ---
  useEffect(() => {
    if (editorRef.current && note) {
      editorRef.current.innerHTML = note.content || "";
      updateWordCount(note.content || "");
    }
  }, [note?.id]);

  if (!note) return <div className="editor">Select or create a note</div>;

  // --- Formatting ---
  const applyFormat = (cmd, value = null) => {
    if (!note.locked) {
      document.execCommand(cmd, false, value);
      triggerSave();
    }
  };

  // --- Word count ---
  const updateWordCount = (text) => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    setWordCount({ words, chars });
  };

  // --- Debounced Auto Save ---
  const triggerSave = () => {
    if (!editorRef.current) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    setSaved(false);

    saveTimeout.current = setTimeout(() => {
      const content = editorRef.current.innerHTML;
      updateNote(note.id, { content });
      updateWordCount(editorRef.current.innerText);
      setSaved(true);
    }, 600);
  };

  // --- Encryption / Decryption ---
  const handleEncrypt = () => {
    const pwd = prompt("Enter password to encrypt:");
    if (!pwd) return;
    const encrypted = encryptText(note.content, pwd);
    updateNote(note.id, { content: encrypted, locked: true });
  };

  const handleDecrypt = (pwd) => {
    try {
      const decrypted = decryptText(note.content, pwd);
      updateNote(note.id, { content: decrypted, locked: false });
      setPassword("");
    } catch {
      alert("Wrong password");
    }
  };

  // --- AI Action Handler ---
  // --- AI Action Handler ---
// --- AI Action Handler (connected to aiService.js) ---
const handleAI = async (action) => {
  if (!editorRef.current) return;
  const text = editorRef.current.innerText.trim();
  if (!text) {
    alert("No content to analyze!");
    return;
  }

  setAiResult("⏳ Thinking...");
  try {
    let result = "";

    if (action === "summarize") {
      const res = await summarize(text);
      result = res.result || res.summary || JSON.stringify(res);
    } else if (action === "tags") {
      const res = await suggestTags(text);
      result = res.result || res.tags?.join(", ") || JSON.stringify(res);
    } else if (action === "grammar") {
      const res = await grammarCheck(text);
      result = res.result || res.corrected || JSON.stringify(res);
    } else if (action === "glossary") {
      const res = await glossaryTerms(text);
      result = res.result || res.glossary || JSON.stringify(res);
    } else {
      result = "⚠️ Unknown AI action.";
    }

    setAiResult(result);
// Duration based on message length (min 5s, max 20s)
const displayDuration = Math.min(
  Math.max(result.length * 40, 5000),
  20000
);
setTimeout(() => setAiResult(""), displayDuration);
  } catch (error) {
    console.error("AI request failed:", error);
    setAiResult("⚠️ AI processing failed.");
  }
};



  // --- File Export ---
  const downloadFile = async (type) => {
    const text = editorRef.current?.innerText || "";
    const title = note.title || "note";

    if (type === "txt") {
      const blob = new Blob([text], { type: "text/plain" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${title}.txt`;
      a.click();
      URL.revokeObjectURL(a.href);
    }

    if (type === "pdf") {
      const doc = new jsPDF();
      const lines = doc.splitTextToSize(text, 180);
      doc.text(lines, 10, 10);
      doc.save(`${title}.pdf`);
    }

    if (type === "docx") {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [new Paragraph({ children: [new TextRun(text)] })],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${title}.docx`;
      a.click();
      URL.revokeObjectURL(a.href);
    }
  };

  // --- JSX ---
  return (
    <div
      className={`editor ${note.locked ? "locked" : ""} ${
        darkMode ? "dark" : ""
      }`}
    >
      {/* Header */}
      <div className="editor-header">
        <div className="left">
          <button className="top-btn" title="Toggle Sidebar" onClick={toggleSidebar}>
            ☰
          </button>
          <input
            className="note-title"
            type="text"
            value={note.title}
            placeholder="Untitled"
            onChange={(e) => updateNote(note.id, { title: e.target.value })}
          />
        </div>

        <div className="editor-actions">
          <span title="Auto Save">{saved ? "Saved" : "Saving..."}</span>
          <button
            className="top-btn"
            onClick={toggleDarkMode}
            title="Toggle Dark Mode"
          >
            🌙
          </button>

          {/* --- Export Dropdown --- */}
          <div className="share-dropdown">
            <button
              className="top-btn"
              onClick={() => setShareOpen((prev) => !prev)}
              title="Share or Export Note"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M4 12v8h16v-8M12 16l-4-4h3V4h2v8h3l-4 4z" />
              </svg>
            </button>

            {shareOpen && (
              <div className="dropdown-menu">
                <button onClick={() => downloadFile("pdf")}>Export as PDF</button>
                <button onClick={() => downloadFile("txt")}>Export as TXT</button>
                <button onClick={() => downloadFile("docx")}>Export as DOCX</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- Toolbar --- */}
      <Toolbar
        note={note}
        applyFormat={applyFormat}
        encryptNote={handleEncrypt}
        decryptNote={() => handleDecrypt(password)}
        deleteNote={deleteNote}
        runAI={handleAI} 
      />

      {/* --- Editable Area --- */}
      <div
        ref={editorRef}
        className="note-content"
        contentEditable={!note.locked}
        suppressContentEditableWarning={true}
        onInput={triggerSave}
      />

      <div className="status-bar">
        Words: {wordCount.words} | Chars: {wordCount.chars}
        {aiResult && <div className="ai-popup">{aiResult}</div>}

      </div>

      {/* --- Lock Overlay --- */}
      {note.locked && (
        <div className="lock-overlay">
          <div className="lock-box">
            <p>This note is encrypted 🔒</p>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="toggle-password"
              onClick={() => setShowPassword((p) => !p)}
            >
              {showPassword ? "🙈" : "👁"}
            </button>
            <button
              className="unlock-btn"
              onClick={() => handleDecrypt(password)}
            >
              Unlock
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
