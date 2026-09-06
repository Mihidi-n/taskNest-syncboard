export default function BoardMembers({ board }) {
  if (!board?.owner) return null

  const people = [
    { id: board.owner.id, name: board.owner.name, email: board.owner.email, role: 'owner' },
    ...board.members.map((m) => ({ id: m.id, name: m.name, email: m.email, role: m.role })),
  ]

  return (
    <div style={{ display: 'flex', gap: '6px' }}>
      {people.map((p) => (
        <div key={p.id} className="board-member">
          <div className="board-member__avatar">
            {p.name?.slice(0, 2).toUpperCase() || '?'}
          </div>

          <div className="board-member__tooltip">
            <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{p.email}</div>
            <div style={{ fontSize: 11, color: '#999', marginTop: 2, textTransform: 'capitalize' }}>
              {p.role}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}