import { useEffect, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './TaskDetailModal.css'

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

  // Open the native dialog when this component mounts
  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  // If a different task gets selected while a modal is already open,
  // reset local fields to match it
  useEffect(() => {
    setDescription(task.description ?? '')
    setStartDate(toDateOrNull(task.startDate))
    setDueDate(toDateOrNull(task.dueDate))
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

  function handleSave() {
    if (dateError) return
    onSave({
      description,
      startDate: toIsoDateOrNull(startDate),
      dueDate: toIsoDateOrNull(dueDate),
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
      onCancel={handleClose} // fires on Esc
      onClick={(e) => {
        if (e.target === dialogRef.current) handleClose() // backdrop click
      }}
    >
      <div
        className="task-detail-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="task-detail-modal__header">
          <h2>{task.title}</h2>
          <button
            className="task-detail-modal__close"
            aria-label="Close"
            onClick={handleClose}
          >
            ×
          </button>
        </header>

        <label className="task-detail-modal__label" htmlFor="task-description">
          Description
        </label>
        <textarea
          id="task-description"
          className="task-detail-modal__textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a more detailed description..."
          rows={5}
        />

        <div className="task-detail-modal__dates">
          <div className="task-detail-modal__date-field">
            <label className="task-detail-modal__label">Start Date</label>
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
            <label className="task-detail-modal__label">Due Date</label>
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
        </div>

        {dateError && <p className="task-detail-modal__error">{dateError}</p>}

        <footer className="task-detail-modal__actions">
          <button className="task-detail-modal__delete" onClick={handleDelete}>
            Delete
          </button>
          <div className="task-detail-modal__actions-right">
            <button className="task-detail-modal__cancel" onClick={handleClose}>
              Cancel
            </button>
            <button className="task-detail-modal__save" onClick={handleSave}>
              Save
            </button>
          </div>
        </footer>
      </div>
    </dialog>
  )
}