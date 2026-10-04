import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ShortcutsDialog } from './ShortcutsDialog'

describe('ShortcutsDialog', () => {
  it('keeps a closed help panel out of the accessibility tree', () => {
    render(<ShortcutsDialog open={false} onClose={vi.fn()} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('lists both shortcuts once the panel is open', () => {
    render(<ShortcutsDialog open onClose={vi.fn()} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAccessibleName(/keyboard shortcuts/i)
    expect(dialog).toHaveTextContent('/')
    expect(dialog).toHaveTextContent('?')
  })

  it('closes from the button, not only from Esc', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(<ShortcutsDialog open onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalled()
  })
})
