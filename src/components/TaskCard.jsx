import { tags } from '../data/mockData'
import LabelBadge from './LabelBadge'
import './TaskCard.css'

/**
 * TaskCard — leaf component, renders one task.
 * Mostly presentational: it owns no state and talks to the outside
 * world only through the handlers it's given. Clicking the card (but
 * not the delete button) opens TaskDetailModal via onOpen.
 */
export default function TaskCard({ task, onDragStart, onDelete, onOpen }) {
  const tag = tags[task.tag]

  return (
    <article
      className="task-card"
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={() => onOpen(task.id)}
      style={{ '--tag-color': tag?.color ?? 'var(--color-border)' }}
    >
      <header className="task-card__top">
        <span className="task-card__id">{task.id}</span>
        <button
          className="task-card__delete"
          aria-label={`Remove ${task.title}`}
          onClick={(e) => {
            e.stopPropagation()
            onDelete(task.id)
          }}
        >
          ×
        </button>
      </header>

      <h3 className="task-card__title">{task.title}</h3>
      {task.description && (
        <p className="task-card__desc">{task.description}</p>
      )}

      <footer className="task-card__bottom">
        <LabelBadge labels={task.labels} />
        {task.assignee && (
          <span className="task-card__assignee" title={task.assignee}>
            {task.assignee.slice(0, 2).toUpperCase()}
          </span>
        )}
      </footer>
    </article>
  )
}
