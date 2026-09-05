import AddColumnForm from './AddColumnForm'
import Column from './Column'
import './Board.css'

export default function Board({
  columns,
  tasks,
  canEdit,
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
          canEdit={canEdit}
          onDrop={onDrop}
          onDelete={onDeleteTask}
          onAddTask={onAddTask}
          onOpenTask={onOpenTask}
          onRenameColumn={onRenameColumn}
          onDeleteColumn={onDeleteColumn}
        />
      ))}
      {canEdit && <AddColumnForm onAdd={onAddColumn} />}
    </div>
  )
}