import { renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { useShortcuts } from './useShortcuts'

describe('useShortcuts', () => {
  it('focuses the filter on /', async () => {
    const onFocusFilter = vi.fn()
    renderHook(() => useShortcuts({ onFocusFilter, onToggleHelp: vi.fn() }))
    await userEvent.keyboard('/')
    expect(onFocusFilter).toHaveBeenCalled()
  })

  it('opens the help panel on ?', async () => {
    const onToggleHelp = vi.fn()
    renderHook(() => useShortcuts({ onFocusFilter: vi.fn(), onToggleHelp }))
    await userEvent.keyboard('?')
    expect(onToggleHelp).toHaveBeenCalled()
  })

  it('does not steal keys while a person is typing in a field', async () => {
    const onFocusFilter = vi.fn()
    const input = document.createElement('input')
    document.body.append(input)
    input.focus()
    renderHook(() => useShortcuts({ onFocusFilter, onToggleHelp: vi.fn() }))
    await userEvent.keyboard('/')
    expect(onFocusFilter).not.toHaveBeenCalled()
    input.remove()
  })
})
