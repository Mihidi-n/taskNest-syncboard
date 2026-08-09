import { tags } from '../data/mockData'
import LabelBadge from './LabelBadge'
import './TaskCard.css'

/**
 * TaskCard — renders one task card.
 */
export default function TaskCard({ task, onDragStart, onDelete, onOpen }) {
  const tag = tags[task.tag]

  return (
    <article
      className="task-card"
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={() => onOpen(task.id)}
      style={{
        '--tag-color': tag?.color ?? 'var(--color-border)',
      }}
    >
      <div className="task-card__top">
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
      </div>

      <h3 className="task-card__title">{task.title}</h3>

      {task.description && (
        <p className="task-card__desc">
          {task.description}
        </p>
      )}

      <footer className="task-card__bottom">
        <div className="task-card__metadata">
          <LabelBadge labels={task.labels} />

          {task.dueDate && (
            <span className="task-card__due-date">
              📅 {task.dueDate}
            </span>
          )}
        </div>

        {task.assignee && (
          <span
            className="task-card__assignee"
            title={task.assignee}
          >
            {task.assignee.slice(0, 2).toUpperCase()}
          </span>
        )}
      </footer>
    </article>
  )
}