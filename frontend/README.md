# CollabBoard

A Trello-style Kanban board — the default project from the Group Project
Brief. This delivers **M1: Static Front-End Skeleton** (due 2 Aug per the
brief; see the note in the chat reply about your actual timeline).

**What M1 is, and isn't:** a React app with Board/Column/TaskCard
components rendering mock data, with drag-and-drop between columns for a
real Trello feel. There is **no backend, no database, and no login yet** —
those are M2 and M3. Tasks reset on page refresh; that's expected at this
stage, not a bug.



**Why mock data is shaped the way it is:** `src/data/mockData.js` mirrors
what a Mongoose `Task` document + Express endpoint will likely return in
M2 (`id`, `columnId`, `title`, `description`, `tag`, `assignee`). When you
build the real API, you're aiming to make `fetch('/api/tasks')` return
something close to this shape — then `Board.jsx` barely changes, you're
just swapping `useState(initialTasks)` for a `useEffect` that fetches.

## Setup — run it locally

Requires Node.js 18+ (check with `node -v`).

```bash

npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`). You should see
three columns with cards you can drag between them, delete, or add to.

Other scripts:
- `npm run build` — production build into `dist/` (you won't need this until M5's deployment step)
- `npm run preview` — serve that production build locally to sanity-check it

## What's already working

- Drag a card to another column (native HTML5 drag-and-drop, no library)
- Delete a card (`×` button)
- Add a card to any column (inline form at the bottom)
- Responsive header; keyboard-focus outlines on interactive elements

## What's deliberately NOT here yet (later milestones)

| Missing piece | Comes in |
|---|---|
| Real backend / Express API | M2 |
| MongoDB persistence | M3 |
| Data survives a refresh (localStorage) | M3 |
| Login / auth | M2 |
| Tests (Jest/RTL/Supertest) + CI | M4 |
| WebSocket live sync, Docker, deployment | M5 |

## Before Session 1 wraps

1. Read `GIT_WORKFLOW.md` and agree your branch strategy as a team.
2. Push this to a shared GitHub repo (steps are in that same file).
3. Everyone clones it, doesn't just receive a zip of it.
4. Confirm CollabBoard (or your approved alternative) with the facilitator
   if you haven't already.
