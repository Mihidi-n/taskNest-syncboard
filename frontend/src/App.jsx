import { useState } from 'react'
import Board from './components/Board'
import BoardSwitcher from './components/BoardSwitcher'
import TaskFilterBar from './components/TaskFilterBar'
import TaskDetailModal from './components/TaskDetailModal'
import ShareBoardModal from './components/ShareBoardModal'
import { useBoards } from './hooks/useBoards'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import { useAuth } from './context/AuthContext.jsx'

export default function App() {
  const { user, initializing, logout } = useAuth()

  const {
    boards,
    activeBoard,
    activeBoardId,
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

  const [showCreateBoard, setShowCreateBoard] = useState(false)
  const [newBoardTitle, setNewBoardTitle] = useState('')

  const [searchQuery, setSearchQuery] = useState('')

  const filteredBoards = boards.filter((board) =>
    board.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const [filterFn, setFilterFn] = useState(() => (tasks) => tasks)

  const visibleTasks = filterFn(activeBoard.tasks)

  const selectedTask =
    activeBoard.tasks.find((task) => task.id === selectedTaskId) ?? null

  const handleCreateBoard = () => {
    if (newBoardTitle.trim() === '') return

    createBoard(newBoardTitle.trim())
    setNewBoardTitle('')
    setShowCreateBoard(false)
  }

  if (initializing) {
    return <div className="app__loading">Loading…</div>
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/*"
        element={
          !user ? (
            <Navigate to="/login" replace />
          ) : (
            <div className="app">
              <header className="app__header">
                <div className="app__brand">
                  <span className="app__brand-mark">TN</span>

                  <div>
                    <h1 className="app__title">TaskNest</h1>
                  </div>
                </div>

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

                  <span className="app__user">{user.name}</span>
                  <button className="app__logout" onClick={logout}>
                    Log out
                  </button>

                  <span className="app__badge">
                    
                  </span>
                </div>
              </header>

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

              <div className="app__toolbar">
                <BoardSwitcher
                  boards={filteredBoards}
                  activeBoardId={activeBoardId}
                  onSelect={selectBoard}
                  onCreate={createBoard}
                  searchQuery={searchQuery}
                />

                <TaskFilterBar
                  tasks={activeBoard.tasks}
                  onFilterChange={setFilterFn}
                />
              </div>

              <Board
                columns={activeBoard.columns}
                tasks={visibleTasks}
                onDrop={moveTask}
                onDeleteTask={deleteTask}
                onAddTask={addTask}
                onOpenTask={setSelectedTaskId}
                onAddColumn={createColumn}
                onRenameColumn={renameColumn}
                onDeleteColumn={deleteColumn}
              />

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

              {isShareOpen && (
                <ShareBoardModal
                  board={activeBoard}
                  onClose={() => setIsShareOpen(false)}
                />
              )}
            </div>
          )
        }
      />
    </Routes>
  )
}