export function serializeUser(user) {
  return { id: user._id.toString(), name: user.name, email: user.email }
}

export function serializeBoard(board, requestingUserId) {
  const ownerRaw = board.owner
  const ownerId = ownerRaw?._id
    ? ownerRaw._id.toString()
    : ownerRaw?.toString?.() ?? null

  const isOwner = ownerId === requestingUserId

  const seen = new Set()
  const dedupedMembers = (board.members || []).filter((m) => {
    if (!m.user) return false
    const uid = m.user._id ? m.user._id.toString() : m.user.toString()
    if (uid === ownerId) return false
    if (seen.has(uid)) return false
    seen.add(uid)
    return true
  })

  const membership = dedupedMembers.find((m) => {
    const uid = m.user._id ? m.user._id.toString() : m.user.toString()
    return uid === requestingUserId
  })
  const role = isOwner ? 'owner' : membership?.role || null

  return {
    id: board._id.toString(),
    name: board.name,
    owner: {
      id: ownerId,
      name: ownerRaw?.name || 'Unknown',
      email: ownerRaw?.email || '',
    },
    members: dedupedMembers.map((m) => ({
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
    createdAt: task.createdAt,
  }
}