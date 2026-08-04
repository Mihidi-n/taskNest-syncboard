import './TaskFilterBar.css'

/**
 * TaskFilterBar
 * Feature: "filter the cards"
 *
 * Already wired in — rendered inside App.jsx's toolbar, right next to
 * BoardSwitcher. You don't need to import this anywhere or touch App.jsx.
 *
 * Props you get:
 *   tasks               — the active board's full task list (read from
 *                          this if you need to know what labels/assignees
 *                          exist, e.g. to build filter chips)
 *   onFilterChange(fn)   — call this with a function of shape
 *                          (tasks) => filteredTasks. App.jsx applies
 *                          whatever function you give it to the live
 *                          task list on every render, so it never goes
 *                          stale when tasks are added/moved/deleted
 *                          elsewhere — just call onFilterChange again
 *                          whenever your filter criteria change (e.g.
 *                          as the user types).
 *
 * Until you call onFilterChange, every task is shown — that's the
 * default, so the rest of the app works normally while you're still
 * building this.
 *
 * What to build:
 *   - A search input filtering by title (and maybe description).
 *   - Optionally: filter chips by label or assignee — see the `tags`
 *     export in src/data/mockData.js for the available label keys/colors.
 *
 * Minimal example of the wiring pattern (delete this and build the real UI):
 *
 *   import { useState } from 'react'
 *   export default function TaskFilterBar({ tasks, onFilterChange }) {
 *     const [query, setQuery] = useState('')
 *     function handleChange(e) {
 *       const q = e.target.value
 *       setQuery(q)
 *       onFilterChange((allTasks) =>
 *         allTasks.filter((t) => t.title.toLowerCase().includes(q.toLowerCase()))
 *       )
 *     }
 *     return <input value={query} onChange={handleChange} placeholder="Search tasks…" />
 *   }
 */
export default function TaskFilterBar({ tasks, onFilterChange }) {
  return (
    <div className="task-filter-bar">
      {/* TODO: build the filter UI here, and call onFilterChange(fn) */}
      <span className="task-filter-bar__placeholder">Filter cards — not built yet</span>
    </div>
  )
}
