export function serializeUser(user) {
  return { id: user._id.toString(), name: user.name, email: user.email }
}

export function serializeBoard(board, requestingUserId) {
  const isOwner = board.owner.toString() === requestingUserId
  const membership = board.members.find((m) => m.user.toString() === requestingUserId)
  const role = isOwner ? 'owner' : membership?.role || null

  return {
    id: board._id.toString(),
    name: board.name,
    owner: board.owner.toString(),
    members: board.members.map((m) => ({ id: m.user.toString(), role: m.role })),
    role,
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
    startDate: task.startDate ? task.startDate.toISOString().slice(0, 10) : null,
    dueDate: task.dueDate ? task.dueDate.toISOString().slice(0, 10) : null,
    labels: task.labels,
    assignee: task.assignee,
    order: task.order,
  }
}