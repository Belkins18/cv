import { cv, project } from '@cv/data'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TechFilter } from './TechFilter'

const data = project(cv, 'en')
const entries = [...data.roles, ...data.projects]

/**
 * В реестре есть и «React», и «React Hook Form», и обе технологии в данных
 * встречаются: простое /React/ нашло бы два чипа сразу. Счётчик в конце имени
 * отделяет сам React от всего, что с него начинается.
 */
const REACT_CHIP = /^React\s*\d+$/

describe('TechFilter', () => {
  it('показывает счётчик совпадений у каждого чипа', () => {
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

  it('клик по чипу добавляет технологию в выбор', async () => {
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

  it('повторный клик убирает технологию', async () => {
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

  it('когда не совпало ничего, показывает подсказку и кнопку сброса', () => {
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

  it('сброс отдаёт пустой выбор', async () => {
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

  it('без выбора подсказки о пустом результате нет', () => {
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
