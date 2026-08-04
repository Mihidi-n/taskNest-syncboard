import './ColumnMenu.css'

/**
 * ColumnMenu
 * Features: "delete option for a list" + "rename a list"
 *
 * Already wired in — rendered inside Column.jsx's header, next to the
 * task count. You don't need to import this anywhere or touch
 * Column.jsx.
 *
 * Props you get:
 *   column          — { id, title } for this column
 *   onRename(title) — call this with the new title to rename the list
 *   onDelete()      — call this to delete the list (and, per the
 *                     shared hook, every task in it — you may want a
 *                     confirm() prompt before calling this)
 *
 * What to build:
 *   A small "…" menu (or two icon buttons) with Rename and Delete.
 *   Rename could be an inline-editable title (click to turn it into an
 *   input, Enter/blur to save) or a tiny popover with a text field —
 *   your call. Either way it should end by calling onRename(newTitle).
 */
export default function ColumnMenu({ column, onRename, onDelete }) {
  return (
    <div className="column-menu">
      {/* TODO: build rename + delete UI here, calling onRename(title) / onDelete() */}
      <span className="column-menu__placeholder">⋯</span>
    </div>
  )
}
