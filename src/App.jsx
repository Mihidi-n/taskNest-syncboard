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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newBoardName, setNewBoardName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter boards based on search
  const filteredBoards = boards.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const [filterFn, setFilterFn] = useState(() => (tasks) => tasks)
  const visibleTasks = filterFn(activeBoard.tasks)
  const selectedTask = activeBoard.tasks.find((t) => t.id === selectedTaskId) ?? null

  const handleCreateBoard = () => {
    if (newBoardName.trim()) {
      createBoard(newBoardName.trim())
      setNewBoardName("")
      setIsCreateModalOpen(false)
    }
  }

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__brand">
          <span className="app__brand-mark">TN</span>
          <h1 className="app__title">TaskNest</h1>
        </div>

        <input 
          type="text"
          placeholder="Search boards..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="app__search"
        />

        <div className="app__header-actions">
          <button className="app__create-btn" onClick={() => setIsCreateModalOpen(true)}>
            + Create Board
          </button>
          <button className="app__share-trigger" onClick={() => setIsShareOpen(true)}>
            Share
          </button>
          <span className="app__badge">mock data · no backend yet</span>
        </div>
      </header>

      <div className="app__toolbar">
        <BoardSwitcher
          boards={filteredBoards}
          activeBoardId={activeBoardId}
          onSelect={selectBoard}
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

      {/* CREATE BOARD MODAL */}
      {isCreateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Board</h2>
            <input 
              type="text"
              placeholder="Enter board title..."
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateBoard()}
              autoFocus
              className="modal__input"
            />
            <div className="modal__actions">
              <button className="modal__create" onClick={handleCreateBoard}>Create</button>
              <button className="modal__cancel" onClick={() => setIsCreateModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

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