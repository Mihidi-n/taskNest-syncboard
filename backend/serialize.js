export function serializeUser(user) {
  return { id: user._id.toString(), name: user.name, email: user.email }
}

export function serializeBoard(board, requestingUserId) {
  const ownerId = board.owner._id ? board.owner._id.toString() : board.owner.toString()
  const isOwner = ownerId === requestingUserId

  const membersWithoutOwner = board.members.filter((m) => {
    const uid = m.user._id ? m.user._id.toString() : m.user.toString()
    return uid !== ownerId
  })

  const membership = membersWithoutOwner.find((m) => {
    const uid = m.user._id ? m.user._id.toString() : m.user.toString()
    return uid === requestingUserId
  })
  const role = isOwner ? 'owner' : membership?.role || null

  return {
    id: board._id.toString(),
    name: board.name,
    owner: {
      id: ownerId,
      name: board.owner.name || 'Unknown',
      email: board.owner.email || '',
    },
    members: membersWithoutOwner.map((m) => ({
      id: m.user._id ? m.user._id.toString() : m.user.toString(),
      name: m.user.name || 'Unknown',
      email: m.user.email || '',
      role: m.role,
    })),
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