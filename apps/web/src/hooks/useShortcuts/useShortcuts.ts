import { useEffect } from 'react'

export type ShortcutHandlers = {
  onFocusFilter: () => void
  onToggleHelp: () => void
}

/**
 * Пока человек печатает, клавиша принадлежит полю, а не странице: иначе
 * «/» в поиске по странице или в любом будущем инпуте уводил бы фокус.
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
