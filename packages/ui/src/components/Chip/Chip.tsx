import { cn } from '../../utils/classNames'

export type ChipProps = {
  label: string
  count?: number
  selected?: boolean
  dimmed?: boolean
  onToggle?: () => void
  className?: string
}

/**
 * Переключатель с семантикой чекбокса: группа чипов — это множественный выбор,
 * а не навигация, поэтому role="checkbox" + aria-checked, а не aria-pressed.
 */
export const Chip = ({
  label,
  count,
  selected = false,
  dimmed = false,
  onToggle,
  className
}: ChipProps) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={selected}
    onClick={onToggle}
    className={cn(
      'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-sm transition-colors',
      'border-border text-ink-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-accent',
      selected && 'border-accent bg-accent text-accent-ink',
      dimmed && !selected && 'opacity-40',
      className
    )}
  >
    <span>{label}</span>
    {count !== undefined && (
      <span className="font-mono text-xs tabular-nums">{count}</span>
    )}
  </button>
)
