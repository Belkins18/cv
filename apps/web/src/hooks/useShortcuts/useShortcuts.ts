import { useEffect } from 'react'

export type ShortcutHandlers = {
  onFocusFilter: () => void
  onToggleHelp: () => void
}

/**
 * While a person is typing, the key belongs to the field, not to the page:
 * otherwise "/" in the browser's find-on-page bar, or in any future input, would
 * steal the focus.
 */
const isTypingTarget = (target: EventTarget | null): boolean =>
  target instanceof HTMLElement &&
  (target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.isContentEditable)

export const useShortcuts = ({
  onFocusFilter,
  onToggleHelp
}: ShortcutHandlers): void => {
  useEffect(() => {
    const handler = (event: KeyboardEvent): void => {
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        isTypingTarget(event.target)
      ) {
        return
      }
      if (event.key === '/') {
        event.preventDefault()
        onFocusFilter()
      }
      if (event.key === '?') {
        event.preventDefault()
        onToggleHelp()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onFocusFilter, onToggleHelp])
}
