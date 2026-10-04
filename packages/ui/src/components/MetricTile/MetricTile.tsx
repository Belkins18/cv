import { useId } from 'react'
import { cn } from '../../utils/classNames'

export type MetricTileProps = {
  value: string
  label: string
  hint?: string
  className?: string
}

/**
 * A "big number plus caption" tile. The caption is tied to the tile through
 * aria-labelledby: without it a bare numeric string means nothing in a screen
 * reader.
 */
export const MetricTile = ({
  value,
  label,
  hint,
  className
}: MetricTileProps) => {
  const labelId = useId()

  return (
    <div
      role="group"
      aria-labelledby={labelId}
      className={cn(
        'rounded-lg border border-border bg-surface-raised px-3 py-2.5',
        className
      )}
    >
      <p className="font-mono text-2xl leading-none tabular-nums text-ink">
        {value}
      </p>
      <p
        id={labelId}
        className="mt-1 text-xs uppercase tracking-wide text-ink-muted"
      >
        {label}
      </p>
      {hint !== undefined && (
        <p className="mt-0.5 text-xs text-ink-muted">{hint}</p>
      )}
    </div>
  )
}
