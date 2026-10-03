export type CvSkeletonProps = { message: string }

/**
 * Скелетон — не декорация: пока данных нет, скринридер должен услышать статус,
 * иначе страница для него просто пустая.
 */
export const CvSkeleton = ({ message }: CvSkeletonProps) => (
  <div role="status" aria-live="polite" className="space-y-3 p-6">
    <span className="sr-only">{message}</span>
    {[0, 1, 2, 3].map((row) => (
      <div
        key={row}
        className="h-16 animate-pulse rounded-lg bg-surface-raised"
      />
    ))}
  </div>
)
