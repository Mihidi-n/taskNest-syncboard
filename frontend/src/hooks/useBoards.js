import { useEffect, useState } from 'react'
import * as api from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'
/**
 * useBoards — connects board, column, and task actions
 * to the backend API and keeps the frontend state in sync.
 */
export function useBoards() {
  const { user } = useAuth()

  const [boards, setBoards] = useState([])
  const [activeBoardId, setActiveBoardId] = useState(null)

  const activeBoard =
    boards.find((b) => b.id === activeBoardId) ??
    boards[0] ?? {
      id: '',
      name: '',
      columns: [],
      tasks: [],
    }
  function updateActiveBoard(updater) {
    setBoards((prev) =>
      prev.map((b) => (b.id === activeBoardId ? updater(b) : b))
    )
  }

  useEffect(() => {
    if (!user) {
      setBoards([])
      setActiveBoardId(null)
      return
    }
    async function loadBoards() {
      try {
        const boardList = await api.getBoards()

        const boardsWithData = await Promise.all(
          boardList.map(async (board) => {
            const [columns, tasks] = await Promise.all([
              api.getColumns(board.id),
              api.getTasks(board.id),
            ])

            return {
              ...board,
              columns,
              tasks,
            }
          })
        )

        setBoards(boardsWithData)

        if (boardsWithData.length > 0) {
          setActiveBoardId(boardsWithData[0].id)
        } else {
          setActiveBoardId(null)
        }
      } catch (error) {
        console.error('Failed to load boards:', error)
      }
    }

    loadBoards()
  }, [user])
  // ---- Boards ----

  async function createBoard(name) {
    try {
      const newBoard = await api.createBoard(name)

      const [columns, tasks] = await Promise.all([
        api.getColumns(newBoard.id),
        api.getTasks(newBoard.id),
      ])

      const boardWithData = {
        ...newBoard,
        columns,
        tasks,
      }

      setBoards((prev) => [...prev, boardWithData])
      setActiveBoardId(newBoard.id)

      return boardWithData
    } catch (error) {
      console.error('Failed to create board:', error)
      return null
    }
  }

  function selectBoard(id) {
    setActiveBoardId(id)
  }

  // ---- Columns (lists) ----

  async function createColumn(title) {
    if (!activeBoardId) return

    try {
      const newColumn = await api.createColumn(activeBoardId, title)

      updateActiveBoard((b) => ({
        ...b,
        columns: [...b.columns, newColumn],
      }))

      return newColumn
    } catch (error) {
      console.error('Failed to create column:', error)
      return null
    }
  }

  async function renameColumn(columnId, title) {
    try {
      const updatedColumn = await api.updateColumn(columnId, title)

      updateActiveBoard((b) => ({
        ...b,
        columns: b.columns.map((c) =>
          c.id === columnId ? updatedColumn : c
        ),
      }))

      return updatedColumn
    } catch (error) {
      console.error('Failed to rename column:', error)
      return null
    }
  }

  async function deleteColumn(columnId) {
    try {
      await api.deleteColumn(columnId)

      updateActiveBoard((b) => ({
        ...b,
        columns: b.columns.filter((c) => c.id !== columnId),
        tasks: b.tasks.filter((t) => t.columnId !== columnId),
      }))
    } catch (error) {
      console.error('Failed to delete column:', error)
    }
  }

  // ---- Tasks ----
  async function addTask(columnId, title) {
    try {
      const newTask = await api.createTask(columnId, {
        title,
      })

      updateActiveBoard((b) => ({
        ...b,
        tasks: [...b.tasks, newTask],
      }))

      return newTask
    } catch (error) {
      console.error('Failed to create task:', error)
      return null
    }
  }

  async function deleteTask(taskId) {
    try {
      await api.deleteTask(taskId)

      updateActiveBoard((b) => ({
        ...b,
        tasks: b.tasks.filter((t) => t.id !== taskId),
      }))
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  /** fields can include any of: title, description, dueDate, labels, assignee */
  async function updateTask(taskId, fields) {
    try {
      const updatedTask = await api.updateTask(taskId, fields)

      updateActiveBoard((b) => ({
        ...b,
        tasks: b.tasks.map((t) =>
          t.id === taskId ? updatedTask : t
        ),
      }))

      return updatedTask
    } catch (error) {
      console.error('Failed to update task:', error)
      return null
    }
  }

  async function moveTask(taskId, targetColumnId) {
    if (!activeBoardId) return null

    try {
      const destinationTasks = activeBoard.tasks.filter(
        (t) =>
          t.columnId === targetColumnId &&
          t.id !== taskId
      )

      const newOrder = destinationTasks.length

      const updatedTask = await api.moveTask(
        taskId,
        targetColumnId,
        newOrder
      )

      const refreshedTasks = await api.getTasks(activeBoardId)

      updateActiveBoard((b) => ({
        ...b,
        tasks: refreshedTasks,
      }))

      return updatedTask
    } catch (error) {
      console.error('Failed to move task:', error)
      return null
    }
  }

  return {
    boards,
    activeBoard,
    activeBoardId,
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