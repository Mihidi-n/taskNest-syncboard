import AddColumnForm from './AddColumnForm'
import Column from './Column'
import './Board.css'

/**
 * Board — top-level layout for the active board's columns.
 *
 * State now lives in App.jsx (via the useBoards hook) so it can be
 * shared across multiple boards; this component is just presentational
 * — it renders what it's given and forwards events upward.
 */
export default function Board({
  columns,
  tasks,
  onDrop,
  onDeleteTask,
  onAddTask,
  onOpenTask,
  onAddColumn,
  onRenameColumn,
  onDeleteColumn,
}) {
  return (
    <div className="board">
      {columns.map((column) => (
        <Column
          key={column.id}
          column={column}
          tasks={tasks.filter((t) => t.columnId === column.id)}
          onDrop={onDrop}
          onDelete={onDeleteTask}
          onAddTask={onAddTask}
          onOpenTask={onOpenTask}
          onRenameColumn={onRenameColumn}
          onDeleteColumn={onDeleteColumn}
        />
      ))}
      <AddColumnForm onAdd={onAddColumn} />
    </div>
  )
}
