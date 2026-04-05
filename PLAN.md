# Task Tracker - Daily Journal App

## Stack

- **React 19 + Vite** (existing boilerplate)
- **Tailwind CSS v4** - utility-first styling
- **shadcn/ui** - polished component library (you own the code)
- **Dexie.js** - clean IndexedDB wrapper for local-first persistence
- **Zustand** - lightweight state management
- **React Router v7** - routing (useful now, essential when Tauri wrapping)
- **date-fns** - date utilities

## Data Model (IndexedDB via Dexie)

Three tables:

- **`workdays`** - `{ id: "2026-04-04", date, streak }`
- **`tasks`** - `{ id, dayId, title, type: "planned"|"unplanned", status: "todo"|"in_progress"|"done"|"carry_forward"|"discontinued", priority, tags[], notes }`
- **`day_logs`** - `{ id, dayId, calls: [{title, time, participants, notes}], discussions: string, generalNotes: string }`

Tasks marked `carry_forward` automatically seed the next day's planned tasks when that day is first opened.

## UI Layout

```
App Shell
├── Sidebar (date nav + streak + Export/Import)
└── Main Panel - DayView
    ├── Day Header (date, completion score badge)
    ├── Planned Tasks (status chips + inline edit)
    ├── Unplanned Tasks (add on the fly)
    ├── Calls Log (time, who, notes)
    └── Notes & Discussions (free text)
```

## Task Status Flow & Colors

Each task moves through statuses via a single-click chip:

- `todo` → amber
- `in_progress` → blue
- `done` → green (confetti pop animation)
- `carry_forward` → purple (auto-moves to next day)
- `discontinued` → red/strikethrough

## Fun/Motivational Touches

- **Day completion score** - % of planned tasks done, shown as a color ring in the header
- **Streak counter** in sidebar - consecutive days with at least one task logged
- **Micro-animation** on task completion (scale + color flash)
- **Colorful tag system** - assign a color tag to tasks (e.g. "meetings" = orange, "deep work" = teal)
- **Carry Forward is automatic** - no manual copy-paste; discontinued tasks are archived with a reason

## File Structure

```
src/
├── components/
│   ├── ui/              ← shadcn generated components
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
│   └── index.js         ← Dexie schema + helpers
├── store/
│   └── useDayStore.js   ← Zustand store
├── hooks/
│   └── useDay.js        ← data fetching hook
└── App.jsx              ← Router + layout shell
```

## Key Files to Replace/Create

- `src/App.jsx` - replace boilerplate with Router + layout shell
- `src/App.css` and `src/index.css` - replace with Tailwind directives + CSS variables for the color theme
- `src/db/index.js` - new Dexie database setup
- `src/store/useDayStore.js` - new Zustand store

## Export / Import (Data Portability)

An **Export** button in the sidebar dumps your entire database to a single `.json` file:

```json
{
  "exportedAt": "2026-04-04T10:00:00Z",
  "version": 1,
  "workdays": [...],
  "tasks": [...],
  "day_logs": [...]
}
```

An **Import** button lets you select that file on any machine and restore everything. A confirmation dialog warns you before overwriting existing data. This covers the "new laptop" and "manual backup" scenarios with zero infrastructure.

The same Export/Import works unchanged inside Tauri - no modifications needed when wrapping.

**Optional Tauri enhancement (for later):** Tauri gives native filesystem access, so you could auto-save the export to a OneDrive/Dropbox folder on a schedule, making backups happen silently without clicking Export manually. Not needed upfront - worth revisiting once the desktop app is set up.

## Tauri-Readiness

Everything is local-first (IndexedDB), no backend required. When ready to wrap with Tauri, the only changes needed are: add `tauri` to `package.json` scripts, configure `tauri.conf.json`, and optionally swap IndexedDB for Tauri's SQLite plugin for better querying. No UI code changes needed.

## Build Order (Todos)

1. Install dependencies: tailwindcss, shadcn/ui, dexie, zustand, react-router-dom, date-fns
2. Configure Tailwind CSS v4 and set up CSS variables for the color theme in index.css
3. Initialize shadcn/ui and add core components: Button, Badge, Card, Dialog, Input, Textarea, Popover
4. Create `src/db/index.js` with Dexie schema for workdays, tasks, and day_logs tables + carry-forward seeding logic
5. Create Zustand store (`src/store/useDayStore.js`) for current day state and task CRUD operations
6. Rewrite `App.jsx` with React Router, main layout (sidebar + main panel), and wipe boilerplate CSS
7. Build Sidebar component: date navigation, streak counter, mini calendar
8. Build DayView page with DayHeader (date + completion score), Planned Tasks section, Unplanned Tasks section
9. Build TaskCard with inline status cycling, priority indicator, color tags, and done animation
10. Build CallsLog and NotesPanel components for the bottom sections of the day view
11. Build Export/Import feature - dump all IndexedDB data to a JSON file and restore from one, accessible from the sidebar
