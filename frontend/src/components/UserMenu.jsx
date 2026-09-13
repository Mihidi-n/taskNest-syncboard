import { useState } from 'react'

export default function UserMenu({ user, role, onLogout, onUpdateName }) {
  const [open, setOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [nameDraft, setNameDraft] = useState(user.name)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    if (!nameDraft.trim()) return
    setSaving(true)
    setError('')
    try {
      await onUpdateName(nameDraft.trim())
      setIsEditing(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: '#172b4d',
          color: 'white',
          fontSize: 11,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {user.name?.slice(0, 2).toUpperCase() || '?'}
      </button>

      {open && (
        <>
          <div
            onClick={() => {
              setOpen(false)
              setIsEditing(false)
            }}
            style={{ position: 'fixed', inset: 0, zIndex: 10 }}
          />
          <div
            style={{
              position: 'absolute',
              top: '36px',
              right: 0,
              background: '#FFFFFF',
              border: '1px solid #E2E5ED',
              borderRadius: '8px',
              padding: '14px',
              boxShadow: '0 6px 16px rgba(18, 28, 59, 0.12)',
              width: '220px',
              zIndex: 11,
            }}
          >
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    fontSize: 13,
                    marginBottom: 8,
                    border: '1px solid #E2E5ED',
                    borderRadius: 4,
                    color: '#16213F',
                  }}
                />
                {error && (
                  <p style={{ color: '#E2685A', fontSize: 12, margin: '0 0 8px' }}>
                    {error}
                  </p>
                )}
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                      flex: 1,
                      padding: '6px',
                      fontSize: 12,
                      background: '#3D5AFE',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                    }}
                  >
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setNameDraft(user.name)
                      setError('')
                    }}
                    style={{
                      flex: 1,
                      padding: '6px',
                      fontSize: 12,
                      background: '#F2F4F8',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      color: '#16213F',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#16213F' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: 12, color: '#667085', marginBottom: 6 }}>
                  {user.email}
                </div>
                {role && (
                  <div
                    style={{
                      fontSize: 11,
                      color: '#667085',
                      textTransform: 'capitalize',
                      marginBottom: 10,
                    }}
                  >
                    {role} on this board
                  </div>
                )}
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    width: '100%',
                    padding: '6px',
                    fontSize: 12,
                    background: '#F2F4F8',
                    border: '1px solid #E2E5ED',
                    borderRadius: 4,
                    cursor: 'pointer',
                    marginBottom: 6,
                    color: '#16213F',
                  }}
                >
                  Edit name
                </button>
                <button
                  onClick={onLogout}
                  style={{
                    width: '100%',
                    padding: '6px',
                    fontSize: 12,
                    background: 'transparent',
                    border: '1px solid #E2E5ED',
                    borderRadius: 4,
                    cursor: 'pointer',
                    color: '#E2685A',
                  }}
                >
                  Log out
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}