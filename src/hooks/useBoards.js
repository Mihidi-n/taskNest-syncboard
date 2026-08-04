import { useState } from 'react'
import { initialBoards } from '../data/mockBoards'

/**
 * useBoards — single source of truth for every board's columns and
 * tasks. This is shared plumbing, already wired into App.jsx. You
 * shouldn't need to edit this file to build your feature — everything
 * your component needs arrives as props. If you think you need
 * something this hook doesn't provide, ask in the group chat before
 * editing it; it's the one file everyone's feature depends on, so an
 * unplanned change here can break someone else's work.
 *
 * Still in-memory only (mock data, resets on refresh) — that's
 * expected until M3 wires up real persistence.
 */
export function useBoards() {
  const [boards, setBoards] = useState(initialBoards)
  const [activeBoardId, setActiveBoardId] = useState(initialBoards[0].id)

  const activeBoard = boards.find((b) => b.id === activeBoardId) ?? boards[0]

  function updateActiveBoard(updater) {
    setBoards((prev) =>
      prev.map((b) => (b.id === activeBoardId ? updater(b) : b))
    )
  }

  // ---- Boards ----

  function createBoard(name) {
    const id = `board-${Date.now()}`
    const board = {
      id,
      name,
      columns: [
        { id: 'col-todo', title: 'To Do' },
        { id: 'col-doing', title: 'Doing' },
        { id: 'col-done', title: 'Done' },
      ],
      tasks: [],
    }
    setBoards((prev) => [...prev, board])
    setActiveBoardId(id)
    return board
  }

  function selectBoard(id) {
    setActiveBoardId(id)
  }

  // ---- Columns (lists) ----

  function createColumn(title) {
    updateActiveBoard((b) => ({
      ...b,
      columns: [...b.columns, { id: `col-${Date.now()}`, title }],
    }))
  }

  function renameColumn(columnId, title) {
    updateActiveBoard((b) => ({
      ...b,
      columns: b.columns.map((c) => (c.id === columnId ? { ...c, title } : c)),
    }))
  }

  function deleteColumn(columnId) {
    updateActiveBoard((b) => ({
      ...b,
      columns: b.columns.filter((c) => c.id !== columnId),
      tasks: b.tasks.filter((t) => t.columnId !== columnId),
    }))
  }

  // ---- Tasks ----

  function addTask(columnId, title) {
    updateActiveBoard((b) => ({
      ...b,
      tasks: [
        ...b.tasks,
        {
          id: `TB-${Date.now()}`,
          columnId,
          title,
          description: '',
          tag: 'frontend',
          labels: [],
          dueDate: null,
          assignee: 'You',
        },
      ],
    }))
  }

  function deleteTask(taskId) {
    updateActiveBoard((b) => ({
      ...b,
      tasks: b.tasks.filter((t) => t.id !== taskId),
    }))
  }

  /** fields can include any of: title, description, dueDate, labels, assignee */
  function updateTask(taskId, fields) {
    updateActiveBoard((b) => ({
      ...b,
      tasks: b.tasks.map((t) => (t.id === taskId ? { ...t, ...fields } : t)),
    }))
  }

  function moveTask(taskId, targetColumnId) {
    updateActiveBoard((b) => ({
      ...b,
      tasks: b.tasks.map((t) =>
        t.id === taskId ? { ...t, columnId: targetColumnId } : t
      ),
    }))
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
