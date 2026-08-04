import './BoardSwitcher.css'

/**
 * BoardSwitcher
 * Feature: "creating another board & filtering the boards"
 *
 * Already wired in — rendered inside App.jsx's toolbar. You don't
 * need to import this anywhere or touch App.jsx.
 *
 * Props you get:
 *   boards        — array of { id, name, columns, tasks }, every board that exists
 *   activeBoardId — id of the board currently on screen
 *   onSelect(id)  — call this to switch which board is shown
 *   onCreate(name) — call this to create a new board (it becomes active automatically)
 *
 * What to build:
 *   1. Something showing the current board's name that can be clicked
 *      to reveal the full list of boards (a dropdown, a slide-out panel,
 *      whatever you like).
 *   2. A text input that filters that list by name as the user types.
 *   3. Clicking a board in the list calls onSelect(board.id).
 *   4. A small form/prompt to create a board, calling onCreate(name).
 *
 * Look at src/components/Column.jsx's "add a card" form for an existing
 * example of an inline add-form pattern you can copy the style of.
 * Use the CSS tokens in src/styles/index.css (--color-accent,
 * --color-border, --radius-sm, --shadow-card, --font-body, --font-mono)
 * so this matches the rest of the app.
 */
export default function BoardSwitcher({ boards, activeBoardId, onSelect, onCreate }) {
  return (
    <div className="board-switcher">
      {/* TODO: build the board switcher UI here */}
      <span className="board-switcher__placeholder">Board switcher — not built yet</span>
    </div>
  )
}
