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
          <button className="app__share-trigger" onClick={() => setIsShareOpen(true)}>
            Share
          </button>
          <span className="app__badge">mock data · no backend yet</span>
        </div>
      </header>

      <div className="app__toolbar">
        <BoardSwitcher
          boards={boards}
          activeBoardId={activeBoardId}
          onSelect={selectBoard}
          onCreate={createBoard}
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
