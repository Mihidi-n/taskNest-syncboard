import { authFetch } from './authFetch.js'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

async function request(endpoint, options = {}) {
  const response = await authFetch(`${API_BASE_URL}${endpoint}`, options)

  if (response.status === 204) {
    return null
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(
      data?.error ||
        data?.message ||
        `Request failed with status ${response.status}`
    )
  }

  return data
}

export function getBoards() {
  return request('/api/boards')
}

export function createBoard(name) {
  return request('/api/boards', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
}

export function getBoard(boardId) {
  return request(`/api/boards/${boardId}`)
}

export function updateBoard(boardId, name) {
  return request(`/api/boards/${boardId}`, {
    method: 'PATCH',
    body: JSON.stringify({ name }),
  })
}

export function deleteBoard(boardId) {
  return request(`/api/boards/${boardId}`, {
    method: 'DELETE',
  })
}

export function shareBoard(boardId, role) {
  return request(`/api/boards/${boardId}/share`, {
    method: 'POST',
    body: JSON.stringify({ role }),
  })
}

export function joinBoard(token) {
  return request(`/api/boards/join/${token}`, {
    method: 'POST',
  })
}

export function getColumns(boardId) {
  return request(`/api/columns/board/${boardId}`)
}

export function createColumn(boardId, title) {
  return request(`/api/columns/board/${boardId}`, {
    method: 'POST',
    body: JSON.stringify({ title }),
  })
}

export function updateColumn(columnId, title) {
  return request(`/api/columns/${columnId}`, {
    method: 'PATCH',
    body: JSON.stringify({ title }),
  })
}

export function deleteColumn(columnId) {
  return request(`/api/columns/${columnId}`, {
    method: 'DELETE',
  })
}

export function getTasks(boardId) {
  return request(`/api/tasks/board/${boardId}`)
}

export function createTask(columnId, taskData) {
  return request(`/api/tasks/column/${columnId}`, {
    method: 'POST',
    body: JSON.stringify(taskData),
  })
}

export function updateTask(taskId, taskData) {
  return request(`/api/tasks/${taskId}`, {
    method: 'PATCH',
    body: JSON.stringify(taskData),
  })
}

export function moveTask(taskId, columnId, order) {
  return request(`/api/tasks/${taskId}/move`, {
    method: 'PATCH',
    body: JSON.stringify({
      columnId,
      order,
    }),
  })
}

export function deleteTask(taskId) {
  return request(`/api/tasks/${taskId}`, {
    method: 'DELETE',
  })
}