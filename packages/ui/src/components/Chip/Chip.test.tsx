import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Chip } from './Chip'

describe('Chip', () => {
  it('reports its state through aria-checked', () => {
    render(<Chip label="React" selected onToggle={vi.fn()} />)
    expect(screen.getByRole('checkbox', { name: /React/ })).toBeChecked()
  })

  it('shows the count next to the label', () => {
    render(<Chip label="React" count={7} onToggle={vi.fn()} />)
    expect(screen.getByRole('checkbox', { name: /React/ })).toHaveTextContent(
      '7'
    )
  })

  it('calls onToggle on a click and on the space key', async () => {
    const onToggle = vi.fn()
    const user = userEvent.setup()
    render(<Chip label="React" onToggle={onToggle} />)
    const chip = screen.getByRole('checkbox', { name: /React/ })
    await user.click(chip)
    chip.focus()
    await user.keyboard(' ')
    expect(onToggle).toHaveBeenCalledTimes(2)
  })

  it('keeps a dimmed chip in the accessibility tree, so the size of the whole set stays visible', () => {
    render(<Chip label="Solana" dimmed onToggle={vi.fn()} />)
    expect(screen.getByRole('checkbox', { name: /Solana/ })).toBeVisible()
  })
})
