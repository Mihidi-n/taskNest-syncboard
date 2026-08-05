import { useState } from 'react'
import Board from './components/Board'
import BoardSwitcher from './components/BoardSwitcher'
import TaskFilterBar from './components/TaskFilterBar'
import TaskDetailModal from './components/TaskDetailModal'
import ShareBoardModal from './components/ShareBoardModal'
import { useBoards } from './hooks/useBoards'
import './App.css'

export default function App() {
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
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateBoard, setShowCreateBoard] = useState(false)
  const [newBoardTitle, setNewBoardTitle] = useState("")

  const handleCreateBoard = () => {
  if (newBoardTitle.trim() === "") return
  createBoard(newBoardTitle)
  setNewBoardTitle("")
  setShowCreateBoard(false)
}

  // TaskFilterBar controls this via onFilterChange — see that component
  // for how it's used. Defaults to "show everything" until it's built.
  const [filterFn, setFilterFn] = useState(() => (tasks) => tasks)
  const visibleTasks = filterFn(activeBoard.tasks)

  const selectedTask = activeBoard.tasks.find((t) => t.id === selectedTaskId) ?? null

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__brand">
          <span className="app__brand-mark">TN</span>
          <div>
            <h1 className="app__title">TaskNest</h1>
            <p className="app__subtitle"></p>
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

  {/* CREATE BOARD BUTTON */}
          <button className="app__create-btn" onClick={() => setShowCreateBoard(true)}>
            + Create Board
          </button>

          <button className="app__share-trigger" onClick={() => setIsShareOpen(true)}>
            Share
          </button>
          <span className="app__badge">mock data · no backend yet</span>
        </div>
      </header>

      {/* CREATE BOARD MODAL */}
{showCreateBoard && (
  <div className="modal-overlay" onClick={() => setShowCreateBoard(false)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h2>Create New Board</h2>
      <input
        type="text"
        placeholder="Enter board title..."
        value={newBoardTitle}
        onChange={(e) => setNewBoardTitle(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleCreateBoard()}
        autoFocus
      />
      <div className="modal-actions">
        <button onClick={handleCreateBoard}>Create</button>
        <button onClick={() => setShowCreateBoard(false)}>Cancel</button>
      </div>
    </div>
  </div>
)}

      <div className="app__toolbar">
        <BoardSwitcher
          boards={boards}
          activeBoardId={activeBoardId}
          onSelect={selectBoard}
          onCreate={createBoard}
          searchQuery={searchQuery}
        />
        <TaskFilterBar tasks={activeBoard.tasks} onFilterChange={setFilterFn} />
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
          onSave={(fields) => updateTask(selectedTask.id, fields)}
          onDelete={() => {
            deleteTask(selectedTask.id)
            setSelectedTaskId(null)
          }}
        />
      )}

      {isShareOpen && (
        <ShareBoardModal board={activeBoard} onClose={() => setIsShareOpen(false)} />
      )}
    </div>
  )
}
