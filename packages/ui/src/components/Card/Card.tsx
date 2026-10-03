import type { ElementType, ReactNode } from 'react'
import { cn } from '../../utils/classNames'

export type CardProps = {
  children: ReactNode
  as?: ElementType
  dimmed?: boolean
  className?: string
}

/**
 * Погашенная карточка остаётся в документе: видно и соответствие фильтру,
 * и общий масштаб списка. `as` позволяет вложить карточку в article/li,
 * не ломая семантику окружающей разметки.
 */
export const Card = ({
  children,
  as: Tag = 'div',
  dimmed = false,
  className
}: CardProps) => (
  <Tag
    data-dimmed={dimmed}
    className={cn(
      'rounded-lg border border-border bg-surface-raised p-4 transition-opacity',
      dimmed && 'opacity-35',
      className
    )}
  >
    {children}
  </Tag>
)
