import './LabelBadge.css'

/**
 * LabelBadge
 * Feature: "adding labels (to show the most essential)"
 *
 * Already wired in — rendered inside TaskCard.jsx's footer, for every
 * task. You don't need to import this anywhere or touch TaskCard.jsx.
 *
 * Props you get:
 *   labels — array of label keys for this task, e.g. ['backend'] or
 *            ['design', 'bug']. Can be empty.
 *
 * Look up each key in the `tags` export from src/data/mockData.js to
 * get its display label and color, e.g.:
 *   import { tags } from '../data/mockData'
 *   tags['backend'] // → { label: 'Back End', color: 'var(--tag-backend)' }
 *
 * What to build:
 *   Render each label as a small colored pill (see .task-card__tag in
 *   TaskCard.css for the existing single-tag styling you can extend to
 *   handle multiple). Since the brief specifically wants labels to
 *   "show the most essential" info at a glance, consider:
 *     - only showing the 1–2 most important labels directly, with a
 *       "+N" for the rest (a task rarely needs to show every label on
 *       a crowded card)
 *     - deciding what "most important" means for your team (e.g. `bug`
 *       always shown first, since it signals something urgent)
 */
export default function LabelBadge({ labels }) {
  if (!labels || labels.length === 0) return null

  return (
    <span className="label-badge">
      {/* TODO: render label pills here using the `tags` map from mockData.js */}
    </span>
  )
}
