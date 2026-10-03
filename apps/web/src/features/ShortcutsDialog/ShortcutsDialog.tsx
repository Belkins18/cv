import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

export type ShortcutsDialogProps = { open: boolean; onClose: () => void }

/**
 * Нативный `<dialog>`: модальность, фокус-ловушка и Esc приезжают от платформы,
 * библиотека ради одной справки не нужна. Кнопка закрытия есть отдельно —
 * тому, кто открыл справку мышью, Esc знать неоткуда.
 */
export const ShortcutsDialog = ({ open, onClose }: ShortcutsDialogProps) => {
  const ref = useRef<HTMLDialogElement>(null)
  const { t } = useTranslation()

  useEffect(() => {
    const dialog = ref.current
    if (dialog === null) return
    /*
     * `showModal` есть не везде: jsdom его не реализует, и часть webview тоже.
     * Как и с `matchMedia`, защита живёт в компоненте, а не в полифиле тестов —
     * справка тогда открывается немодально, но открывается.
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
