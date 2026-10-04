export type CvErrorProps = {
  message: string
  retryLabel: string
  onRetry: () => void
}

/**
 * The data chunk may have returned a 404 or broken JSON. An eternal skeleton in
 * that case is a lie: the visitor has to see what broke and be given something
 * to fix it with.
 */
export const CvError = ({ message, retryLabel, onRetry }: CvErrorProps) => (
  <div role="alert" className="m-6 rounded-lg border border-border p-6">
    <p className="text-ink">{message}</p>
    <button
      type="button"
      onClick={onRetry}
      className="mt-3 rounded-md border border-accent px-3 py-1.5 text-accent"
    >
      {retryLabel}
    </button>
  </div>
)
