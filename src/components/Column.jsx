import { useState } from 'react'
import ColumnMenu from './ColumnMenu'
import TaskCard from './TaskCard'
import './Column.css'

/**
 * Column — holds one lane (To Do / Doing / Done) worth of TaskCards,
 * the inline "add task" affordance, the drop target for drag/drop,
 * and (via ColumnMenu) rename/delete for the list itself.
 */
export default function Column({
  column,
  tasks,
  onDrop,
  onDelete,
  onAddTask,
  onOpenTask,
  onRenameColumn,
  onDeleteColumn,
}) {
  const [isOver, setIsOver] = useState(false)
  const [draftTitle, setDraftTitle] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  function handleDragOver(e) {
    e.preventDefault()
    setIsOver(true)
  }

  function handleDrop(e) {
    e.preventDefault()
    setIsOver(false)
    const taskId = e.dataTransfer.getData('text/plain')
    onDrop(taskId, column.id)
  }

  function submitDraft(e) {
    e.preventDefault()
    if (!draftTitle.trim()) return
    onAddTask(column.id, draftTitle.trim())
    setDraftTitle('')
    setIsAdding(false)
  }

  return (
    <section
      className={`column ${isOver ? 'column--over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsOver(false)}
      onDrop={handleDrop}
    >
      <header className="column__header">
        <h2 className="column__title">{column.title}</h2>
        <div className="column__header-actions">
          <span className="column__count">{tasks.length}</span>
          <ColumnMenu
            column={column}
            onRename={(title) => onRenameColumn(column.id, title)}
            onDelete={() => onDeleteColumn(column.id)}
          />
        </div>
      </header>

      <div className="column__list">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDragStart={(e, id) => e.dataTransfer.setData('text/plain', id)}
            onDelete={onDelete}
            onOpen={onOpenTask}
          />
        ))}

        {tasks.length === 0 && !isAdding && (
          <p className="column__empty">Nothing here yet — drag a card over or add one below.</p>
        )}
      </div>

      {isAdding ? (
        <form className="column__add-form" onSubmit={submitDraft}>
          <input
            autoFocus
            type="text"
            placeholder="Task title…"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onBlur={() => !draftTitle && setIsAdding(false)}
          />
          <div className="column__add-actions">
            <button type="submit" className="column__add-confirm">Add card</button>
            <button type="button" className="column__add-cancel" onClick={() => setIsAdding(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button className="column__add-trigger" onClick={() => setIsAdding(true)}>
          + Add a card
        </button>
      )}
    </section>
  )
}
