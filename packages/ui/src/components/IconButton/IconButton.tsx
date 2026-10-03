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
 * Кнопка без текста: label обязателен, иначе в скринридере остаётся пустая
 * кнопка. aria-pressed пишется только когда кнопка действительно двухпозиционная
 * — у обычной кнопки этого атрибута быть не должно.
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
