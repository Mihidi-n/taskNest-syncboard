/**
 * The frontend expects plain objects with `id` (not `_id`). Route every
 * response through one of these so the shape stays consistent across
 * everyone's controllers. Add more here if you add fields to a model.
 */

export function serializeUser(user) {
  return { id: user._id.toString(), name: user.name, email: user.email }
}

export function serializeBoard(board) {
  return {
    id: board._id.toString(),
    name: board.name,
    owner: board.owner.toString(),
    members: (board.members || []).map((m) => m.toString()),
  }
}

export function serializeColumn(col) {
  return {
    id: col._id.toString(),
    boardId: col.boardId.toString(),
    title: col.title,
    order: col.order,
  }
}

export function serializeTask(task) {
  return {
    id: task._id.toString(),
    columnId: task.columnId.toString(),
    boardId: task.boardId.toString(),
    title: task.title,
    description: task.description,
    dueDate: task.dueDate ? task.dueDate.toISOString().slice(0, 10) : null,
    labels: task.labels,
    assignee: task.assignee,
    order: task.order,
  }
}
