import './AddColumnForm.css'

/**
 * AddColumnForm
 * Feature: "adding lists"
 *
 * Already wired in — rendered inside Board.jsx, after the existing
 * columns. You don't need to import this anywhere or touch Board.jsx.
 *
 * Props you get:
 *   onAdd(title) — call this with the new list's name to create it.
 *                  It's added to the active board and shows up
 *                  immediately (Board re-renders with the new column).
 *
 * What to build:
 *   A "+ Add another list" trigger that reveals a small inline form
 *   (title input + confirm/cancel), matching the pattern Column.jsx
 *   already uses for "+ Add a card" — open that file for a working
 *   example of the exact interaction (click to reveal a form, submit
 *   to confirm, blur-when-empty to cancel) you can copy.
 */
export default function AddColumnForm({ onAdd }) {
  return (
    <div className="add-column-form">
      {/* TODO: build the "add a list" UI here, and call onAdd(title) */}
      <span className="add-column-form__placeholder">+ Add a list — not built yet</span>
    </div>
  )
}
