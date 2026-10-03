import type { ReactNode } from 'react'
import { cn } from '../../utils/classNames'

export type SectionTitleProps = {
  id: string
  children: ReactNode
  className?: string
}

/**
 * Заголовок раздела с обязательным id: на него ссылается aria-labelledby
 * секции — без этого разделы в списке ориентиров безымянны.
 */
export const SectionTitle = ({
  id,
  children,
  className
}: SectionTitleProps) => (
  <h2
    id={id}
    className={cn(
      'mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted',
      className
    )}
  >
    {children}
  </h2>
)
