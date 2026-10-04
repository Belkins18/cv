import type { ReactNode } from 'react'
import { cn } from '../../utils/classNames'

export type IconButtonProps = {
  label: string
  children: ReactNode
  onClick?: () => void
  pressed?: boolean
  className?: string
}

/**
 * A button with no text: label is required, otherwise a screen reader is left
 * announcing an empty button. aria-pressed is written only when the button
 * really is a two-state toggle — a plain button must not carry the attribute.
 */
export const IconButton = ({
  label,
  children,
  onClick,
  pressed,
  className
}: IconButtonProps) => (
  <button
    type="button"
    aria-label={label}
    {...(pressed === undefined ? {} : { 'aria-pressed': pressed })}
    onClick={onClick}
    className={cn(
      'inline-flex size-8 items-center justify-center rounded-md border border-border text-ink-muted',
      'hover:text-ink focus-visible:outline-2 focus-visible:outline-accent',
      className
    )}
  >
    {children}
  </button>
)
