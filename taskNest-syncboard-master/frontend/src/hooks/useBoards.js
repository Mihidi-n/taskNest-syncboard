import { useState, useEffect } from 'react'
import * as api from '../api'

/**
 * useBoards — single source of truth for every board's columns and
 * tasks. Fetches data from the real backend API.
 *
 * Returns boards, columns, and tasks from the server.
 * All mutations (create/update/delete/move) make real HTTP requests.
 */
export function useBoards() {
  const [boards, setBoards] = useState([])
  const [activeBoardId, setActiveBoardId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Columns and tasks for the active board
  const [columns, setColumns] = useState([])
  const [tasks, setTasks] = useState([])

  const activeBoard = boards.find((b) => b.id === activeBoardId)

  // Load boards on mount
  useEffect(() => {
    async function loadBoards() {
      try {
        setLoading(true)
        const boardList = await api.listBoards()
        setBoards(boardList)
        if (boardList.length > 0) {
          setActiveBoardId(boardList[0].id)
        }
        setError(null)
      } catch (err) {
        setError(err.message)
        console.error('Failed to load boards:', err)
      } finally {
        setLoading(false)
      }
    }
    loadBoards()
  }, [])

  // Load columns and tasks when active board changes
  useEffect(() => {
    if (!activeBoardId) return

    async function loadBoardData() {
      try {
        const [columnList, taskList] = await Promise.all([
          api.listColumns(activeBoardId),
          api.listTasks(activeBoardId),
        ])
        setColumns(columnList)
        setTasks(taskList)
        setError(null)
      } catch (err) {
        setError(err.message)
        console.error('Failed to load board data:', err)
      }
    }
    loadBoardData()
  }, [activeBoardId])

  // ---- Boards ----

  async function createBoard(name) {
    try {
      const newBoard = await api.createBoard(name)
      setBoards((prev) => [...prev, newBoard])
      setActiveBoardId(newBoard.id)
      setError(null)
      return newBoard
    } catch (err) {
      setError(err.message)
      console.error('Failed to create board:', err)
      throw err
    }
  }

  function selectBoard(id) {
    setActiveBoardId(id)
  }

  // ---- Columns (lists) ----

  async function createColumn(title) {
    if (!activeBoardId) throw new Error('No active board')
    try {
      const newColumn = await api.createColumn(activeBoardId, title)
      setColumns((prev) => [...prev, newColumn])
      setError(null)
      return newColumn
    } catch (err) {
      setError(err.message)
      console.error('Failed to create column:', err)
      throw err
    }
  }

  async function renameColumn(columnId, title) {
    try {
      const updated = await api.updateColumn(columnId, title)
      setColumns((prev) =>
        prev.map((c) => (c.id === columnId ? updated : c))
      )
      setError(null)
      return updated
    } catch (err) {
      setError(err.message)
      console.error('Failed to rename column:', err)
      throw err
    }
  }

  async function deleteColumn(columnId) {
    try {
      await api.deleteColumn(columnId)
      setColumns((prev) => prev.filter((c) => c.id !== columnId))
      setTasks((prev) => prev.filter((t) => t.columnId !== columnId))
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('Failed to delete column:', err)
      throw err
    }
  }

  // ---- Tasks ----

  async function addTask(columnId, title) {
    try {
      const newTask = await api.createTask(columnId, { title })
      setTasks((prev) => [...prev, newTask])
      setError(null)
      return newTask
    } catch (err) {
      setError(err.message)
      console.error('Failed to create task:', err)
      throw err
    }
  }

  async function deleteTask(taskId) {
    try {
      await api.deleteTask(taskId)
      setTasks((prev) => prev.filter((t) => t.id !== taskId))
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('Failed to delete task:', err)
      throw err
    }
  }

  /** fields can include any of: title, description, dueDate, labels, assignee */
  async function updateTask(taskId, fields) {
    try {
      const updated = await api.updateTask(taskId, fields)
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? updated : t))
      )
      setError(null)
      return updated
    } catch (err) {
      setError(err.message)
      console.error('Failed to update task:', err)
      throw err
    }
  }

  /**
   * Move task to target column.
   * Calculates the order based on current tasks in the target column.
   */
  async function moveTask(taskId, targetColumnId) {
    try {
      // Find all tasks currently in the target column and calculate the new order
      const tasksInTargetColumn = tasks.filter((t) => t.columnId === targetColumnId)
      const newOrder = tasksInTargetColumn.length

      const updated = await api.moveTask(taskId, targetColumnId, newOrder)
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? updated : t))
      )
      setError(null)
      return updated
    } catch (err) {
      setError(err.message)
      console.error('Failed to move task:', err)
      throw err
    }
  }

  return {
    boards,
    activeBoard,
    activeBoardId,
    columns,
    tasks,
    loading,
    error,
    createBoard,
    selectBoard,
    createColumn,
    renameColumn,
    deleteColumn,
    addTask,
    deleteTask,
    updateTask,
    moveTask,
  }
}