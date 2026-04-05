# Work Tracker

A personal daily journal app for tracking work - built to replace the boring spreadsheet habit with something actually fun to use.

## What it does

Each day gets its own journal page with:

- **Planned Tasks** - what you set out to do that day
- **Unplanned Tasks** - things that came up during the day
- **Task status tracking** - To Do → In Progress → Done → Carry Forward → Discontinued
- **Subtasks** - checklist of sub-items on any task, with green tick completion
- **Priority levels** - Low, Medium, High per task
- **Calls log** - log calls with time, participants, and notes
- **Discussions & Notes** - free-text sections for key decisions and general notes
- **Day completion score** - a live ring showing % of tasks done
- **Streak counter** - consecutive days with logged work

Tasks marked **Carry Forward** automatically appear as planned tasks the next day you open.

## Running

**In the browser (dev mode):**
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173).

**As a desktop app (Tauri dev mode):**
```bash
npm run tauri dev
```
Opens as a native Windows window. First run compiles Rust dependencies (~5-10 min). Subsequent runs are fast.

**Build a distributable installer:**
```bash
npm run tauri build
```
Output: `src-tauri/target/release/bundle/nsis/Work Tracker_0.1.0_x64-setup.exe`

## Data & privacy

All data is stored locally on your machine via **IndexedDB** - nothing is sent to any server. Use the **Export / Import** button in the sidebar to back up your data as a `.json` file or restore it on a new device.

## Tech stack

- [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Dexie.js](https://dexie.org/) (IndexedDB)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [React Router v7](https://reactrouter.com/)
- [Tauri v2](https://tauri.app/) (desktop wrapper)

## Roadmap

- [x] React + Vite browser app
- [x] IndexedDB persistence via Dexie
- [x] Tauri desktop app wrapper
- [x] Subtasks with checklist
- [x] Export / Import JSON backup
- [ ] Weekly summary view
- [ ] Search across all days
- [ ] Recurring tasks
- [ ] Dark mode
- [ ] Keyboard shortcuts
- [ ] Named task categories (e.g. Meeting, Deep Work, Review)
