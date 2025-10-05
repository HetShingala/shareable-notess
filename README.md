# Shareable Notes Application

This is a notes application built with React and Vite, featuring a rich text editor, note management (CRUD, pinning, search), encryption, and AI-powered features (summarization, tag suggestions, grammar checking).

---

### Live Demo

**Hosted URL:** [https://shared-notes-app-het.netlify.app/](https://shared-notes-app-het.netlify.app/)

---

### Features Implemented
- Custom Rich Text Editor
- Full Note Management (Create, Edit, Delete, List)
- Note Pinning
- Search by Title or Content
- Data Persistence using Local Storage
- Note Encryption with Password Protection
- AI Summarization
- AI Tag Suggestions
- AI Grammar Checking
- Word and Character Count
- Note Theming (Colors)
- Export to .txt

---

### Known Issues

**Backward Typing on Development Machine:**
There is a persistent bug causing backward text input in the editor *only on the primary development machine*. This issue is confirmed to be an external environmental problem, not a bug in the application's code.

**Troubleshooting Steps Taken:**
* Confirmed CSS `direction: ltr` is correctly applied via the browser inspector. Manually changing this to `rtl` had no effect, proving the CSS is being overridden by the environment.
* Tested in Incognito mode to rule out browser extensions.
* Checked and reset macOS system-wide text direction settings and keyboard input sources.
* Tested creating a new, clean Chrome user profile.
* The issue persists through all troubleshooting, confirming it is a machine-specific environmental problem.