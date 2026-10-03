import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Chip } from './Chip'

describe('Chip', () => {
  it('сообщает состояние через aria-checked', () => {
    render(<Chip label="React" selected onToggle={vi.fn()} />)
    expect(screen.getByRole('checkbox', { name: /React/ })).toBeChecked()
  })

  it('показывает счётчик рядом с меткой', () => {
    render(<Chip label="React" count={7} onToggle={vi.fn()} />)
    expect(screen.getByRole('checkbox', { name: /React/ })).toHaveTextContent(
      '7'
    )
  })

  it('вызывает onToggle по клику и по пробелу', async () => {
    const onToggle = vi.fn()
    const user = userEvent.setup()
    render(<Chip label="React" onToggle={onToggle} />)
    const chip = screen.getByRole('checkbox', { name: /React/ })
    await user.click(chip)
    chip.focus()
    await user.keyboard(' ')
    expect(onToggle).toHaveBeenCalledTimes(2)
  })

  it('погашенный чип остаётся в доступном дереве — общий масштаб набора должен быть виден', () => {
    render(<Chip label="Solana" dimmed onToggle={vi.fn()} />)
    expect(screen.getByRole('checkbox', { name: /Solana/ })).toBeVisible()
  })
})
