import { tags } from '../data/mockData'
import './LabelBadge.css'

/**
 * LabelBadge
 * Displays task labels as small colored pills.
 */
export default function LabelBadge({ labels }) {
  if (!labels || labels.length === 0) return null

  const normalizedLabels = labels
    .map((label) => {
      if (typeof label === 'string') {
        const tag = tags[label]
        return tag
          ? { name: tag.label, color: tag.color, key: label }
          : { name: label, color: 'var(--color-border)', key: label }
      }

      if (typeof label === 'object' && label !== null) {
        return {
          name: label.name ?? label.label ?? 'Label',
          color: label.color ?? 'var(--color-border)',
          key: `${label.name ?? label.label}-${label.color}`,
        }
      }

      return null
    })
    .filter(Boolean)

  if (normalizedLabels.length === 0) return null

  return (
    <div className="task-card__labels">
      {normalizedLabels.slice(0, 2).map((label) => (
        <span
          key={label.key}
          className="task-card__tag"
          style={{ backgroundColor: label.color }}
        >
          {label.name}
        </span>
      ))}

      {normalizedLabels.length > 2 && (
        <span className="task-card__tag-more">
          +{normalizedLabels.length - 2}
        </span>
      )}
    </div>
  )
}