import { useState } from 'react'
import './TaskFilterBar.css'

/**
 * TaskFilterBar
 * Feature: "filter the cards"
 */
export default function TaskFilterBar({ tasks, onFilterChange }) {
  const [query, setQuery] = useState('')

  function handleChange(e) {
    const value = e.target.value
    setQuery(value)

    const q = value.toLowerCase().trim()

    // Wrapped in an extra () => ... on purpose — onFilterChange is a
    // React state setter, and passing a function directly would be
    // treated as an updater rather than the new value. Wrapping it
    // makes React store the function itself as state.
    onFilterChange(() => (allTasks) => {
      if (q === '') return allTasks
      return allTasks.filter((t) => {
        const title = t.title?.toLowerCase() ?? ''
        const description = t.description?.toLowerCase() ?? ''
        return title.includes(q) || description.includes(q)
      })
    })
  }

  return (
    <div className="task-filter-bar">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Filter cards…"
        className="task-filter-bar__input"
      />
    </div>
  )
}