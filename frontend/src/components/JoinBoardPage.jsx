import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { joinBoard } from '../api.js'

export default function JoinBoardPage() {
  const { token } = useParams()
  const { user, initializing } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    if (initializing) return

    if (!user) {
      sessionStorage.setItem('pendingJoinToken', token)
      navigate('/login')
      return
    }

    async function doJoin() {
      try {
        const board = await joinBoard(token)
        navigate('/', { state: { selectBoardId: board.id } })
      } catch (err) {
        setError(err.message || 'This link is invalid or has expired.')
      }
    }
    doJoin()
  }, [user, initializing, token, navigate])

  return <div className="app__loading">{error || 'Joining board…'}</div>
}