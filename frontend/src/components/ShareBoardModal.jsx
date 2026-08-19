import './ShareBoardModal.css'

/**
 * ShareBoardModal
 * Feature: "share the board option"
 *
 * Already wired in — App.jsx renders this when the "Share" button in
 * the top header is clicked (that button already exists and works).
 * You don't need to import this anywhere or touch App.jsx.
 *
 * Props you get:
 *   board    — the active board: { id, name, columns, tasks }
 *   onClose() — call this to close the modal
 *
 * There's no real backend yet, so this is necessarily a mock — that's
 * fine and expected for M1/M2. What to build:
 *   - Generate a fake shareable link, e.g. `https://collabboard.app/b/${board.id}`
 *   - A "Copy link" button using the Clipboard API:
 *       navigator.clipboard.writeText(link)
 *   - Maybe a short note like "Anyone with the link can view this
 *     board" and, optionally, a mock "invite by email" input (doesn't
 *     need to actually send anything yet — there's no backend for it).
 *
 * A native <dialog> works well here too — see TaskDetailModal.jsx's
 * comments for the same suggestion.
 */
export default function ShareBoardModal({ board, onClose }) {
  return (
    <div className="share-board-modal" role="dialog" aria-modal="true">
      {/* TODO: build the real share modal here — this placeholder just proves the wiring works */}
      <div className="share-board-modal__placeholder">
        <p>Share board modal — not built yet.</p>
        <p>Board: {board.name}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}
