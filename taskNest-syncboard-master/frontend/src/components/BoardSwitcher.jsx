import './BoardSwitcher.css'
import { useState, useRef, useEffect } from 'react'

export default function BoardSwitcher({ boards, activeBoardId, onSelect }) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const ref = useRef(null)

  const activeBoard = boards.find(b => b.id === activeBoardId)

  const filteredBoards = boards.filter(board => 
    board.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="board-switcher" ref={ref}>
      {/* Current board name button */}
      <button 
        className="board-switcher__current" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {activeBoard?.name || "Select Board"}
        <span className="arrow">{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* Dropdown with filter + list */}
      {isOpen && (
        <div className="board-switcher__dropdown">
          <input 
            type="text"
            placeholder="Filter boards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="board-switcher__search"
            autoFocus
          />

          <div className="board-switcher__list">
            <div className="board-switcher__section-title">RECENT BOARDS</div>
            
            {filteredBoards.length === 0 && (
              <div className="board-switcher__empty">No boards found</div>
            )}
            {filteredBoards.map(board => (
              <button
                key={board.id}
                className={`board-switcher__item ${board.id === activeBoardId ? 'active' : ''}`}
                onClick={() => {
                  onSelect(board.id)
                  setIsOpen(false)
                }}
              >
                {board.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

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

