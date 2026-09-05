import { useState } from 'react'
import { shareBoard } from '../api.js'

export default function ShareBoardModal({ board, onClose }) {
  const [role, setRole] = useState('viewer')
  const [link, setLink] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function handleGenerate() {
    setIsLoading(true)
    setError('')
    setCopied(false)
    try {
      const result = await shareBoard(board.id, role)
      setLink(result.link)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isOwner = board.role === 'owner'

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Share "{board.name}"</h2>

        {!isOwner ? (
          <p>Only the board owner can generate a share link.</p>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '12px 0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="radio"
                  name="share-role"
                  value="viewer"
                  checked={role === 'viewer'}
                  onChange={() => setRole('viewer')}
                />
                Viewer — can see the board, not edit it
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="radio"
                  name="share-role"
                  value="editor"
                  checked={role === 'editor'}
                  onChange={() => setRole('editor')}
                />
                Editor — can add, edit, and move tasks
              </label>
            </div>

            <button className="modal__create" onClick={handleGenerate} disabled={isLoading}>
              {isLoading ? 'Generating…' : 'Get link'}
            </button>

            {error && <p style={{ color: '#c0392b' }}>{error}</p>}

            {link && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <input
                  type="text"
                  readOnly
                  value={link}
                  onFocus={(e) => e.target.select()}
                  className="modal__input"
                  style={{ flex: 1 }}
                />
                <button className="modal__create" onClick={handleCopy}>
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            )}

            <p style={{ fontSize: '13px', color: '#666', marginTop: '10px' }}>
              Anyone with this link can join as a {role} once they log in or sign up.
            </p>
          </>
        )}

        <div className="modal__actions">
          <button className="modal__cancel" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}