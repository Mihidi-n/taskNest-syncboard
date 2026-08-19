import { useState } from 'react';
import './AddColumnForm.css'

/**
 * AddColumnForm
 * Feature: "adding lists"
 *
 * Already wired in — rendered inside Board.jsx, after the existing
 * columns. You don't need to import this anywhere or touch Board.jsx.
 *
 * Props you get:
 *   onAdd(title) — call this with the new list's name to create it.
 *                  It's added to the active board and shows up
 *                  immediately (Board re-renders with the new column).
 *
 * What to build:
 *   A "+ Add another list" trigger that reveals a small inline form
 *   (title input + confirm/cancel), matching the pattern Column.jsx
 *   already uses for "+ Add a card" — open that file for a working
 *   example of the exact interaction (click to reveal a form, submit
 *   to confirm, blur-when-empty to cancel) you can copy.
 */
export default function AddColumnForm({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');

  const handleAdd = () => {
    if (title.trim() === '') return;
    onAdd(title);
    setTitle('');
    setOpen(false);
  };
  return (
    <div className="add-column-form">
      {!open && (
        <button
          className="add-column-form__trigger"
          onClick={() => setOpen(true)}
        >
          + Add another list
        </button>
      )}
      {open && (
        <div className="add-column-form__popup">
          <input
            className="add-column-form__input"
            placeholder="Enter list name..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        <div className="add-column-form__actions">
          <button
            className="add-column-form__confirm"
            onClick={handleAdd}
          >
            Add list
          </button>

          <button
            className="add-column-form__cancel"
            onClick={() => setOpen(false)}
          >
            X
          </button>
        </div>
      </div>
      )}
  
    </div>
  );
}
