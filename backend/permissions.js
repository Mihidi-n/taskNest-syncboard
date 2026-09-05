export function roleOnBoard(board, userId) {
  if (board.owner.toString() === userId) return 'owner'
  const membership = board.members.find((m) => m.user.toString() === userId)
  return membership ? membership.role : null
}

export function canEdit(role) {
  return role === 'owner' || role === 'editor'
}