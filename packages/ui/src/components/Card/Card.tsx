import type { ElementType, ReactNode } from 'react'
import { cn } from '../../utils/classNames'

export type CardProps = {
  children: ReactNode
  as?: ElementType
  dimmed?: boolean
  className?: string
}

/**
 * A dimmed card stays in the document: both the match against the filter and the
 * overall size of the list remain visible. `as` lets the card become an
 * article/li without breaking the semantics of the surrounding markup.
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
