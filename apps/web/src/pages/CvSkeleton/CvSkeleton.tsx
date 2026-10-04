export type CvSkeletonProps = { message: string }

/**
 * The skeleton is not decoration: while there is no data, a screen reader has to
 * hear a status, otherwise the page is simply empty to it.
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
