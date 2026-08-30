import './ColumnMenu.css'

/**
 * ColumnMenu
 * Feature: delete a list — a small "x" that sits next to the task
 * count in Column.jsx's header. Rename lives in Column.jsx itself
 * (click the list title to edit it), not here.
 */
export default function ColumnMenu({ column, onDelete }) {
  function handleDeleteClick() {
    const confirmed = window.confirm(
      `Delete "${column.title}"? Any tasks in this list will be deleted too.`
    )
    if (confirmed) {
      onDelete()
    }
  }

  return (
    <button
      className="column-menu__delete"
      onClick={handleDeleteClick}
      aria-label={`Delete list ${column.title}`}
      title="Delete list"
    >
      ×
    </button>
  )
}
