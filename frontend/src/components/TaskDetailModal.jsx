import { useEffect, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import { tags } from '../data/mockData'
import LabelBadge from './LabelBadge'

import 'react-datepicker/dist/react-datepicker.css'
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

function toDateOrNull(isoString) {
  return isoString ? new Date(isoString) : null
}

function toIsoDateOrNull(date) {
  if (!date) return null

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export default function TaskDetailModal({ task, onClose, onSave, onDelete }) {
  const dialogRef = useRef(null)

  const [description, setDescription] = useState(task.description ?? '')
  const [startDate, setStartDate] = useState(toDateOrNull(task.startDate))
  const [dueDate, setDueDate] = useState(toDateOrNull(task.dueDate))
  const [dateError, setDateError] = useState('')

  const [assignee, setAssignee] = useState(task.assignee ?? '')
  const [labels, setLabels] = useState(normalizeTaskLabels(task.labels ?? []))
  const [newLabelName, setNewLabelName] = useState('')
  const [newLabelColor, setNewLabelColor] = useState('#2563eb')

  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  useEffect(() => {
    setDescription(task.description ?? '')
    setStartDate(toDateOrNull(task.startDate))
    setDueDate(toDateOrNull(task.dueDate))
    setAssignee(task.assignee ?? '')
    setLabels(normalizeTaskLabels(task.labels ?? []))
    setDateError('')
  }, [task])

  function handleClose() {
    dialogRef.current?.close()
    onClose()
  }

  function handleStartDateChange(date) {
    if (dueDate && date && date > dueDate) {
      setDateError("Start date can't be after the due date.")
      return
    }

    setDateError('')
    setStartDate(date)
  }

  function handleDueDateChange(date) {
    if (startDate && date && date < startDate) {
      setDateError("Due date can't be before the start date.")
      return
    }

    setDateError('')
    setDueDate(date)
  }

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

  function handleSave() {
    if (dateError) return

    onSave({
      description,
      startDate: toIsoDateOrNull(startDate),
      dueDate: toIsoDateOrNull(dueDate),
      assignee,
      labels,
    })

    handleClose()
  }

  function handleDelete() {
    onDelete()
    handleClose()
  }

  return (
    <dialog
      ref={dialogRef}
      className="task-detail-modal"
      onCancel={handleClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) handleClose()
      }}
    >
      <div
        className="task-detail-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="task-detail-modal__header">
          <div>
            <p className="task-detail-modal__task-id">{task.id}</p>
            <h2>{task.title}</h2>
          </div>

          <button
            className="task-detail-modal__close"
            onClick={handleClose}
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
          <div className="task-detail-modal__date-field">
            <label className="task-detail-modal__label">
              Start Date
            </label>

            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              selectsStart
              startDate={startDate}
              endDate={dueDate}
              placeholderText="Select start date"
              dateFormat="MMM d, yyyy"
              isClearable
            />
          </div>

          <div className="task-detail-modal__date-field">
            <label className="task-detail-modal__label">
              Due Date
            </label>

            <DatePicker
              selected={dueDate}
              onChange={handleDueDateChange}
              selectsEnd
              startDate={startDate}
              endDate={dueDate}
              minDate={startDate}
              placeholderText="Select due date"
              dateFormat="MMM d, yyyy"
              isClearable
            />
          </div>
        </section>

        {dateError && (
          <p className="task-detail-modal__error">
            {dateError}
          </p>
        )}

        <section className="task-detail-modal__section task-detail-modal__grid">
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
              <p className="task-detail-modal__note">
                No labels yet.
              </p>
            ) : (
              labels.map((label, index) => (
                <div
                  key={`${label.name}-${index}`}
                  className="task-detail-modal__label-row"
                >
                  <input
                    type="text"
                    value={label.name}
                    onChange={(e) =>
                      handleLabelChange(index, 'name', e.target.value)
                    }
                    aria-label={`Label ${index + 1} name`}
                  />

                  <input
                    type="color"
                    value={label.color}
                    onChange={(e) =>
                      handleLabelChange(index, 'color', e.target.value)
                    }
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
          <button
            type="button"
            className="task-detail-modal__delete"
            onClick={handleDelete}
          >
            Delete
          </button>

          <div className="task-detail-modal__actions-right">
            <button
              type="button"
              className="task-detail-modal__cancel"
              onClick={handleClose}
            >
              Cancel
            </button>

            <button
              type="button"
              className="task-detail-modal__save"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </footer>
    
      </div>
    </dialog>
  )
}