import { cv, project } from '@cv/data'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TechFilter } from './TechFilter'

const data = project(cv, 'en')
const entries = [...data.roles, ...data.projects]

/**
 * The registry holds both "React" and "React Hook Form", and both appear in the
 * data: a plain /React/ would find two chips at once. The count at the end of the
 * accessible name separates React itself from everything that starts with it.
 */
const REACT_CHIP = /^React\s*\d+$/

describe('TechFilter', () => {
  it('shows a match count on every chip', () => {
    render(
      <TechFilter
        entries={entries}
        selected={[]}
        onChange={vi.fn()}
        matchCount={entries.length}
      />
    )
    const react = screen.getByRole('checkbox', { name: REACT_CHIP })
    expect(Number(react.textContent?.replace(/\D/g, ''))).toBeGreaterThan(0)
  })

  it('adds a technology to the selection when its chip is clicked', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <TechFilter
        entries={entries}
        selected={[]}
        onChange={onChange}
        matchCount={entries.length}
      />
    )
    await user.click(screen.getByRole('checkbox', { name: REACT_CHIP }))
    expect(onChange).toHaveBeenCalledWith(['react'])
  })

  it('removes the technology again on a second click', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <TechFilter
        entries={entries}
        selected={['react']}
        onChange={onChange}
        matchCount={5}
      />
    )
    await user.click(screen.getByRole('checkbox', { name: REACT_CHIP }))
    expect(onChange).toHaveBeenCalledWith([])
  })

  it('shows a hint and a reset button when nothing matched', () => {
    render(
      <TechFilter
        entries={entries}
        selected={['solana', 'tron']}
        onChange={vi.fn()}
        matchCount={0}
      />
    )
    expect(screen.getByRole('status')).toHaveTextContent(/nothing matches/i)
    expect(screen.getByTestId('filter-reset')).toBeInTheDocument()
  })

  it('reports an empty selection on reset', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <TechFilter
        entries={entries}
        selected={['solana']}
        onChange={onChange}
        matchCount={0}
      />
    )
    await user.click(screen.getByTestId('filter-reset'))
    expect(onChange).toHaveBeenCalledWith([])
  })

  it('shows no empty-result hint while nothing is selected', () => {
    render(
      <TechFilter
        entries={entries}
        selected={[]}
        onChange={vi.fn()}
        matchCount={entries.length}
      />
    )
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
