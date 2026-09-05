import { useState, useRef, useEffect } from 'react'
import ColumnMenu from './ColumnMenu'
import TaskCard from './TaskCard'
import './Column.css'

export default function Column({
  column,
  tasks,
  canEdit,
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

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState(column.title)
  const titleInputRef = useRef(null)

  useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus()
      titleInputRef.current?.select()
    }
  }, [isEditingTitle])

  function startEditingTitle() {
    if (!canEdit) return
    setTitleDraft(column.title)
    setIsEditingTitle(true)
  }

  function commitTitle() {
    const trimmed = titleDraft.trim()
    if (trimmed && trimmed !== column.title) {
      onRenameColumn(column.id, trimmed)
    } else {
      setTitleDraft(column.title)
    }
    setIsEditingTitle(false)
  }

  function handleTitleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      commitTitle()
    }
    if (e.key === 'Escape') {
      setTitleDraft(column.title)
      setIsEditingTitle(false)
    }
  }

  function handleDragOver(e) {
    if (!canEdit) return
    e.preventDefault()
    setIsOver(true)
  }

  function handleDrop(e) {
    if (!canEdit) return
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
        {isEditingTitle ? (
          <input
            ref={titleInputRef}
            className="column__title-input"
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={handleTitleKeyDown}
            maxLength={60}
          />
        ) : (
          <h2
            className="column__title"
            onClick={startEditingTitle}
            title={canEdit ? 'Click to rename' : ''}
          >
            {column.title}
          </h2>
        )}

        <div className="column__header-actions">
          <span className="column__count">{tasks.length}</span>
          {canEdit && (
            <ColumnMenu
              column={column}
              onDelete={() => onDeleteColumn(column.id)}
            />
          )}
        </div>
      </header>

      <div className="column__list">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            canEdit={canEdit}
            onDragStart={(e, id) => e.dataTransfer.setData('text/plain', id)}
            onDelete={onDelete}
            onOpen={onOpenTask}
          />
        ))}

        {tasks.length === 0 && !isAdding && (
          <p className="column__empty">
            {canEdit
              ? 'Nothing here yet — drag a card over or add one below.'
              : 'Nothing here yet.'}
          </p>
        )}
      </div>

      {canEdit &&
        (isAdding ? (
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
        ))}
    </section>
  )
}