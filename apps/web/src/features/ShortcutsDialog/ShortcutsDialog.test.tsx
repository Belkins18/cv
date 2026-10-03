import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ShortcutsDialog } from './ShortcutsDialog'

describe('ShortcutsDialog', () => {
  it('закрытая справка в дереве доступности не видна', () => {
    render(<ShortcutsDialog open={false} onClose={vi.fn()} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('открытая справка перечисляет обе горячие клавиши', () => {
    render(<ShortcutsDialog open onClose={vi.fn()} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAccessibleName(/keyboard shortcuts/i)
    expect(dialog).toHaveTextContent('/')
    expect(dialog).toHaveTextContent('?')
  })

  it('закрывается кнопкой — не только клавишей Esc', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(<ShortcutsDialog open onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalled()
  })
})
