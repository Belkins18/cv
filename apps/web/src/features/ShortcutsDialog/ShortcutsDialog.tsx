import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

export type ShortcutsDialogProps = { open: boolean; onClose: () => void }

/**
 * A native `<dialog>`: modality, the focus trap and Esc all come from the
 * platform, and one help panel is not worth a library. There is a separate close
 * button as well — someone who opened the panel with a mouse has no way of
 * knowing about Esc.
 */
export const ShortcutsDialog = ({ open, onClose }: ShortcutsDialogProps) => {
  const ref = useRef<HTMLDialogElement>(null)
  const { t } = useTranslation()

  useEffect(() => {
    const dialog = ref.current
    if (dialog === null) return
    /*
     * `showModal` is not everywhere: jsdom does not implement it, and neither do
     * some webviews. As with `matchMedia`, the guard lives in the component
     * rather than in a test polyfill — the panel then opens non-modally, but it
     * opens.
     */
    if (typeof dialog.showModal !== 'function') {
      dialog.open = open
      return
    }
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="shortcuts-title"
      className="rounded-lg border border-border bg-surface-raised p-6 text-ink"
    >
      <h2 id="shortcuts-title" className="mb-3 font-semibold">
        {t('shortcuts.title')}
      </h2>
      <dl className="space-y-1 text-sm">
        <div className="flex gap-3">
          <dt className="font-mono">/</dt>
          <dd>{t('shortcuts.focusFilter')}</dd>
        </div>
        <div className="flex gap-3">
          <dt className="font-mono">?</dt>
          <dd>{t('shortcuts.toggleHelp')}</dd>
        </div>
      </dl>
      <button
        type="button"
        onClick={onClose}
        className="mt-4 rounded-md border border-accent px-3 py-1.5 text-accent"
      >
        {t('shortcuts.close')}
      </button>
    </dialog>
  )
}
