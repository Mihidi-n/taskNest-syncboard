import { useState } from 'react'
import { tags } from '../data/mockData'
import LabelBadge from './LabelBadge'
import './TaskDetailModal.css'

function normalizeTaskLabels(labels = []) {
  return labels
    .map((label, index) => {
      if (typeof label === 'string') {
        const tag = tags[label]
        return {
          name: tag?.label ?? label,
          color: tag?.color ?? 'var(--color-border)',
          raw: label,
          key: `string-${label}-${index}`,
        }
      }

      if (typeof label === 'object' && label !== null) {
        return {
          name: label.name ?? label.label ?? 'Label',
          color: label.color ?? 'var(--color-border)',
          raw: label,
          key: `${label.name ?? label.label}-${label.color}-${index}`,
        }
      }

      return null
    })
    .filter(Boolean)
}

export default function TaskDetailModal({ task, onClose, onSave, onDelete }) {
  const [description, setDescription] = useState(task.description ?? '')
  const [dueDate, setDueDate] = useState(task.dueDate ?? '')
  const [assignee, setAssignee] = useState(task.assignee ?? '')
  const [labels, setLabels] = useState(normalizeTaskLabels(task.labels ?? []))
  const [newLabelName, setNewLabelName] = useState('')
  const [newLabelColor, setNewLabelColor] = useState('#2563eb')

  const handleAddLabel = () => {
    const trimmedName = newLabelName.trim()
    if (!trimmedName) return

    setLabels((current) => [
      ...current,
      { name: trimmedName, color: newLabelColor },
    ])
    setNewLabelName('')
  }

  const handleLabelChange = (index, field, value) => {
    setLabels((current) =>
      current.map((label, idx) =>
        idx === index ? { ...label, [field]: value } : label
      )
    )
  }

  const handleRemoveLabel = (index) => {
    setLabels((current) => current.filter((_, idx) => idx !== index))
  }

  const handleSave = () => {
    onSave({
      description,
      dueDate: dueDate || null,
      assignee,
      labels,
    })
    onClose()
  }

  return (
    <div className="task-detail-modal" role="dialog" aria-modal="true">
      <div className="task-detail-modal__content">
        <header className="task-detail-modal__header">
          <div>
            <p className="task-detail-modal__task-id">{task.id}</p>
            <h2>{task.title}</h2>
          </div>
          <button
            className="task-detail-modal__close"
            onClick={onClose}
            aria-label="Close task details"
          >
            ×
          </button>
        </header>

        <section className="task-detail-modal__section">
          <label>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </label>
        </section>

        <section className="task-detail-modal__section task-detail-modal__grid">
          <label>
            Due date
            <input
              type="date"
              value={dueDate || ''}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </label>

          <label>
            Assigned member
            <input
              type="text"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder="Enter assignee"
            />
          </label>
        </section>

        <section className="task-detail-modal__section">
          <div className="task-detail-modal__section-header">
            <div>
              <h3>Labels</h3>
              <p className="task-detail-modal__help">
                Create or edit labels for this task.
              </p>
            </div>
            <div className="task-detail-modal__label-preview">
              <LabelBadge labels={labels} />
            </div>
          </div>

          <div className="task-detail-modal__label-editor">
            <label>
              Label name
              <input
                type="text"
                value={newLabelName}
                onChange={(e) => setNewLabelName(e.target.value)}
                placeholder="e.g. Front End"
              />
            </label>

            <label>
              Label color
              <input
                type="color"
                value={newLabelColor}
                onChange={(e) => setNewLabelColor(e.target.value)}
              />
            </label>

            <button
              type="button"
              className="task-detail-modal__add-label"
              onClick={handleAddLabel}
              disabled={!newLabelName.trim()}
            >
              Add label
            </button>
          </div>

          <div className="task-detail-modal__label-list">
            {labels.length === 0 ? (
              <p className="task-detail-modal__note">No labels yet.</p>
            ) : (
              labels.map((label, index) => (
                <div key={`${label.name}-${index}`} className="task-detail-modal__label-row">
                  <input
                    type="text"
                    value={label.name}
                    onChange={(e) => handleLabelChange(index, 'name', e.target.value)}
                    aria-label={`Label ${index + 1} name`}
                  />
                  <input
                    type="color"
                    value={label.color}
                    onChange={(e) => handleLabelChange(index, 'color', e.target.value)}
                    aria-label={`Label ${index + 1} color`}
                  />
                  <button
                    type="button"
                    className="task-detail-modal__remove-label"
                    onClick={() => handleRemoveLabel(index)}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <footer className="task-detail-modal__actions">
          <button type="button" onClick={handleSave} className="task-detail-modal__save">
            Save
          </button>
          <button type="button" onClick={onClose} className="task-detail-modal__cancel">
            Cancel
          </button>
          <button type="button" onClick={onDelete} className="task-detail-modal__delete">
            Delete task
          </button>
        </footer>
      </div>
    </div>
  )
}
