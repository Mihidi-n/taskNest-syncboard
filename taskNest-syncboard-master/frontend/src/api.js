/**
 * API client for taskNest backend.
 * All requests include the Authorization header with the stored token.
 * Base URL is inferred from window.location (or use /api for same-origin).
 */

const API_BASE_URL = '/api'

// Helper: get token from localStorage
function getToken() {
    return localStorage.getItem('token')
}

// Helper: build Authorization header
function getAuthHeader() {
    const token = getToken()
    if (!token) throw new Error('No auth token found')
    return { Authorization: `Bearer ${token}` }
}

// Helper: make a request
async function request(method, path, body = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
    }

    if (body) {
        options.body = JSON.stringify(body)
    }

    const response = await fetch(`${API_BASE_URL}${path}`, options)

    // Handle 204 No Content
    if (response.status === 204) {
        return null
    }

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`)
    }

    return data
}

// ============================================================================
// BOARDS
// ============================================================================

export async function listBoards() {
    return request('GET', '/boards')
}

export async function createBoard(name) {
    return request('POST', '/boards', { name })
}

export async function getBoard(id) {
    return request('GET', `/boards/${id}`)
}

export async function updateBoard(id, name) {
    return request('PATCH', `/boards/${id}`, { name })
}

export async function deleteBoard(id) {
    return request('DELETE', `/boards/${id}`)
}

export async function shareBoard(id, email) {
    return request('POST', `/boards/${id}/share`, { email })
}

// ============================================================================
// COLUMNS
// ============================================================================

export async function listColumns(boardId) {
    return request('GET', `/columns/board/${boardId}`)
}

export async function createColumn(boardId, title) {
    return request('POST', `/columns/board/${boardId}`, { title })
}

export async function updateColumn(id, title) {
    return request('PATCH', `/columns/${id}`, { title })
}

export async function deleteColumn(id) {
    return request('DELETE', `/columns/${id}`)
}

// ============================================================================
// TASKS
// ============================================================================

export async function listTasks(boardId) {
    return request('GET', `/tasks/board/${boardId}`)
}

export async function createTask(columnId, { title, description, dueDate, labels, assignee }) {
    const body = { title }
    if (description !== undefined) body.description = description
    if (dueDate !== undefined) body.dueDate = dueDate
    if (labels !== undefined) body.labels = labels
    if (assignee !== undefined) body.assignee = assignee

    return request('POST', `/tasks/column/${columnId}`, body)
}

export async function updateTask(id, fields) {
    return request('PATCH', `/tasks/${id}`, fields)
}

export async function moveTask(id, columnId, order) {
    return request('PATCH', `/tasks/${id}/move`, { columnId, order })
}

export async function deleteTask(id) {
    return request('DELETE', `/tasks/${id}`)
}
