function idOf(value) {
  if (!value) return null
  return value._id ? value._id.toString() : value.toString()
}

export function roleOnBoard(board, userId) {
  const ownerId = idOf(board.owner)
  if (ownerId === userId) return 'owner'
  const membership = (board.members || []).find((m) => idOf(m.user) === userId)
  return membership ? membership.role : null
}

export function canEdit(role) {
  return role === 'owner' || role === 'editor'
}