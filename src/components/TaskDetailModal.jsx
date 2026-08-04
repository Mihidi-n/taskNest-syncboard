import './TaskDetailModal.css'

/**
 * TaskDetailModal
 * Feature: "due dates & description (after clicking)"
 *
 * Already wired in — App.jsx opens this whenever a task card is
 * clicked (that click-to-open wiring is already done in TaskCard.jsx —
 * you don't need to touch it). You don't need to import this
 * component anywhere either.
 *
 * Props you get:
 *   task    — the full task object: { id, title, description, dueDate,
 *             labels, tag, assignee, columnId }. dueDate is either
 *             null or an ISO date string like '2026-08-16'.
 *   onClose()          — call this to close the modal without saving
 *                         further changes (e.g. Cancel button, or the
 *                         backdrop)
 *   onSave(fields)      — call this with an object of just the fields
 *                         you're changing, e.g. onSave({ description:
 *                         '...', dueDate: '2026-08-20' }). Merges into
 *                         the task automatically.
 *   onDelete()          — call this to delete the whole task
 *
 * What to build:
 *   A modal (a native <dialog> works well and is what the rest of the
 *   app would use — see MDN for showModal()/close()) with:
 *     - the task title
 *     - an editable description textarea
 *     - a due date input (type="date")
 *     - Save / Cancel / Delete actions
 *
 * You don't have to call onSave on every keystroke — it's fine to
 * collect changes in local component state and only call onSave once,
 * when the user clicks Save.
 */
export default function TaskDetailModal({ task, onClose, onSave, onDelete }) {
  return (
    <div className="task-detail-modal" role="dialog" aria-modal="true">
      {/* TODO: build the real modal here — this placeholder just proves the wiring works */}
      <div className="task-detail-modal__placeholder">
        <p>Task detail modal — not built yet.</p>
        <p>Selected task: {task.title}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}
