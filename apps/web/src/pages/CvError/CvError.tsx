export type CvErrorProps = {
  message: string
  retryLabel: string
  onRetry: () => void
}

/**
 * Чанк с данными мог отдать 404 или битый JSON. Вечный скелетон в этом случае —
 * ложь: человек обязан увидеть, что сломалось, и иметь чем это починить.
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
