# Work Tracker - Daily Journal App

## Stack

- **React 19 + Vite**
- **Tailwind CSS v4** - utility-first styling
- **shadcn/ui** - polished component library (you own the code)
- **Dexie.js** - clean IndexedDB wrapper for local-first persistence
- **Zustand** - lightweight state management (sidebar state)
- **React Router v7** - routing
- **date-fns** - date utilities
- **Tauri v2** - desktop app wrapper (set up, production build pending)

## Data Model (IndexedDB via Dexie)

Three tables:

- **`workdays`** - `{ id: "2026-04-04", date }`
- **`tasks`** - `{ id, dayId, title, type: "planned"|"unplanned", status: "todo"|"in_progress"|"done"|"carry_forward"|"discontinued", priority: "low"|"medium"|"high", subtasks: [{id, title, done}], notes }`
- **`day_logs`** - `{ dayId, calls: [{id, title, time, participants, notes}], discussions: string, generalNotes: string }`

Tasks marked `carry_forward` automatically seed the next day's planned tasks when that day is first opened.

## UI Layout

```
App Shell
├── Sidebar (date nav + streak + Export/Import)
└── Main Panel - DayView
    ├── Day Header (date, completion score ring)
    ├── Planned Tasks (status badge + subtasks + inline edit)
    ├── Unplanned Tasks (same as above)
    ├── Calls Log (time, who, notes)
    └── Notes & Discussions (two tabs: Discussions / Notes)
```

## Task Status Flow & Colors

Each task status is set via a dropdown badge on the card:

- `todo` → amber
- `in_progress` → blue
- `done` → green (scale animation on completion)
- `carry_forward` → purple (auto-moves to next day's planned tasks)
- `discontinued` → red/strikethrough

## Task Card Features

- Click status badge → dropdown to change status
- Click title → inline edit
- Click priority dot → dropdown (Low / Medium / High)
- Expand arrow → reveals subtasks checklist + notes
- Subtasks: add, tick (green check), rename inline, delete
- Subtask count badge (e.g. 2/4) visible when card is collapsed, turns green when all done
- Hover card → expand arrow + delete button appear

## Fun/Motivational Touches

- **Day completion score** - % of tasks done (excluding discontinued), shown as a colour ring in the header
- **Streak counter** in sidebar - consecutive days with at least one task logged
- **Micro-animation** on task completion (scale + colour flash)
- **Carry Forward is automatic** - no manual copy-paste

## File Structure

```
src/
├── components/
│   ├── ui/                ← shadcn generated components
│   ├── AddTaskDialog.jsx  ← new task dialog (title, notes, priority)
│   ├── Sidebar.jsx
│   ├── DayHeader.jsx
│   ├── TaskCard.jsx
│   ├── TaskSection.jsx
│   ├── CallsLog.jsx
│   ├── NotesPanel.jsx
│   └── ExportImport.jsx
├── pages/
│   └── DayView.jsx
├── db/
│   └── index.js           ← Dexie schema + CRUD helpers
├── store/
│   └── useDayStore.js     ← Zustand (sidebar open/close state)
├── hooks/
│   └── useDay.js          ← useLiveQuery hooks for day data
├── lib/
│   ├── constants.js       ← STATUS_CONFIG, PRIORITY_CONFIG
│   └── utils.js           ← shadcn cn() helper
└── App.jsx                ← Router + layout shell
src-tauri/                 ← Tauri v2 Rust project
├── src/
├── icons/
├── Cargo.toml
└── tauri.conf.json
```

## Export / Import (Data Portability)

Export button in sidebar dumps entire database to a `.json` file:

```json
{
  "exportedAt": "2026-04-04T10:00:00Z",
  "version": 1,
  "workdays": [...],
  "tasks": [...],
  "day_logs": [...]
}
```

Import restores from that file with a confirmation dialog before overwriting.
Works identically in browser and Tauri desktop app.

**Optional Tauri enhancement (for later):** Auto-save export to OneDrive/Dropbox folder via Tauri's native filesystem access.

## Tauri Setup

- Tauri v2 initialised in `src-tauri/`
- App identifier: `com.worktracker.app`
- Window: 1280×800 (min 900×600)
- Icons generated from `src-tauri/app-icon-source.svg`
- Dev: `npm run tauri dev`
- Build: `npm run tauri build` → NSIS installer in `src-tauri/target/release/bundle/`
- Requires: Rust + Microsoft C++ Build Tools (Visual Studio 2022)

## Decisions Log

| Decision | Outcome |
|---|---|
| Colour tags | Removed - arbitrary colours with no fixed meaning. Can revisit as named categories (Meeting, Deep Work, Review etc.) if needed |
| Zustand | Kept minimal - only sidebar toggle state. All data reactivity handled by Dexie `useLiveQuery` |
| Task creation | Dialog with title, notes, priority. All fields also editable inline on the card after creation |
