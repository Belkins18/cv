import type { ReactNode } from 'react'
import { cn } from '../../utils/classNames'

export type SectionTitleProps = {
  id: string
  children: ReactNode
  className?: string
}

/**
 * A section heading with a required id: the section's aria-labelledby points at
 * it — without that, the sections are unnamed in the landmark list.
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
