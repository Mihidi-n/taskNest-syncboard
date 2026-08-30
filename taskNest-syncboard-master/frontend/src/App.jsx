import { useState } from 'react'
import Board from './components/Board'
import BoardSwitcher from './components/BoardSwitcher'
import TaskFilterBar from './components/TaskFilterBar'
import TaskDetailModal from './components/TaskDetailModal'
import ShareBoardModal from './components/ShareBoardModal'
import { useBoards } from './hooks/useBoards'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'

export default function App() {
  const {
    boards,
    activeBoard,
    activeBoardId,
    columns,
    tasks,
    loading,
    error,
    createBoard,
    selectBoard,
    createColumn,
    renameColumn,
    deleteColumn,
    addTask,
    deleteTask,
    updateTask,
    moveTask,
  } = useBoards()

  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const [isShareOpen, setIsShareOpen] = useState(false)

  // Create board state
  const [showCreateBoard, setShowCreateBoard] = useState(false)
  const [newBoardTitle, setNewBoardTitle] = useState('')

  // Search state
  const [searchQuery, setSearchQuery] = useState('')

  // Filter boards based on search
  const filteredBoards = boards.filter((board) =>
    board.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Task filter
  const [filterFn, setFilterFn] = useState(() => (tasks) => tasks)

  const visibleTasks = filterFn(tasks)

  const selectedTask =
    tasks.find((task) => task.id === selectedTaskId) ?? null

  // Create a new board
  const handleCreateBoard = () => {
    if (newBoardTitle.trim() === '') return

    createBoard(newBoardTitle.trim())
    setNewBoardTitle('')
    setShowCreateBoard(false)
  }

  // Show loading state
  if (loading) {
    return (
      <div className="app">
        <header className="app__header">
          <div className="app__brand">
            <span className="app__brand-mark">TN</span>
            <div>
              <h1 className="app__title">TaskNest</h1>
            </div>
          </div>
        </header>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Loading boards...</p>
        </div>
      </div>
    )
  }

  // Show empty state if no boards
  if (!boards || boards.length === 0) {
    return (
      <div className="app">
        <header className="app__header">
          <div className="app__brand">
            <span className="app__brand-mark">TN</span>
            <div>
              <h1 className="app__title">TaskNest</h1>
            </div>
          </div>
          <div className="app__header-actions">
            <button
              className="app__create-btn"
              onClick={() => setShowCreateBoard(true)}
            >
              + Create Board
            </button>
          </div>
        </header>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>No boards yet. Create your first board to get started!</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/*" element={
        <div className="app">
          { }
          <header className="app__header">
            <div className="app__brand">
              <span className="app__brand-mark">TN</span>

              <div>
                <h1 className="app__title">TaskNest</h1>
              </div>
            </div>

            { }
            <div className="app__header-actions">
              <input
                type="text"
                placeholder="Search boards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="app__search"
              />

              <button
                className="app__create-btn"
                onClick={() => setShowCreateBoard(true)}
              >
                + Create Board
              </button>

              <button
                className="app__share-trigger"
                onClick={() => setIsShareOpen(true)}
              >
                Share
              </button>

              {loading && <span className="app__badge">Loading...</span>}
              {error && <span className="app__badge" style={{ color: 'red' }}>{error}</span>}
            </div>
          </header>

          { }
          {showCreateBoard && (
            <div
              className="modal-overlay"
              onClick={() => setShowCreateBoard(false)}
            >
              <div
                className="modal"
                onClick={(e) => e.stopPropagation()}
              >
                <h2>Create New Board</h2>

                <input
                  type="text"
                  placeholder="Enter board title..."
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateBoard()
                    }
                  }}
                  autoFocus
                  className="modal__input"
                />

                <div className="modal__actions">
                  <button
                    className="modal__create"
                    onClick={handleCreateBoard}
                  >
                    Create
                  </button>

                  <button
                    className="modal__cancel"
                    onClick={() => {
                      setShowCreateBoard(false)
                      setNewBoardTitle('')
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          { }
          <div className="app__toolbar">
            <BoardSwitcher
              boards={filteredBoards}
              activeBoardId={activeBoardId}
              onSelect={selectBoard}
              onCreate={createBoard}
              searchQuery={searchQuery}
            />

            <TaskFilterBar
              tasks={tasks}
              onFilterChange={setFilterFn}
            />
          </div>

          { }
          <Board
            columns={columns}
            tasks={visibleTasks}
            onDrop={moveTask}
            onDeleteTask={deleteTask}
            onAddTask={addTask}
            onOpenTask={setSelectedTaskId}
            onAddColumn={createColumn}
            onRenameColumn={renameColumn}
            onDeleteColumn={deleteColumn}
          />

          { }
          {selectedTask && (
            <TaskDetailModal
              task={selectedTask}
              onClose={() => setSelectedTaskId(null)}
              onSave={(fields) =>
                updateTask(selectedTask.id, fields)
              }
              onDelete={() => {
                deleteTask(selectedTask.id)
                setSelectedTaskId(null)
              }}
            />
          )}

          { }
          {isShareOpen && (
            <ShareBoardModal
              board={activeBoard}
              onClose={() => setIsShareOpen(false)}
            />
          )}
        </div>
      } />
    </Routes>
  )
}