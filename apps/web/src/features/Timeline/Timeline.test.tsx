import { cv, project } from '@cv/data'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Timeline } from './Timeline'

const roles = project(cv, 'en').roles
const NOW = new Date(Date.UTC(2026, 9, 3))

describe('Timeline', () => {
  it('показывает все роли, свёрнутыми по умолчанию', () => {
    render(<Timeline roles={roles} selected={[]} locale="en" now={NOW} />)
    expect(screen.getAllByRole('article')).toHaveLength(roles.length)
    expect(screen.queryByText(/manifest-driven/i)).not.toBeInTheDocument()
  })

  it('раскрывает роль по клику', async () => {
    const user = userEvent.setup()
    render(<Timeline roles={roles} selected={[]} locale="en" now={NOW} />)
    await user.click(screen.getByRole('button', { name: /WireX Systems/ }))
    expect(screen.getByText(/manifest-driven/i)).toBeInTheDocument()
  })

  it('показывает период и длительность', () => {
    render(<Timeline roles={roles} selected={[]} locale="en" now={NOW} />)
    const wirex = screen.getByTestId('role-wirex')
    expect(wirex).toHaveTextContent('Jun 2024 — Present')
    expect(wirex).toHaveTextContent('2 yr 5 mo')
  })

  it('при фильтре несовпадающие гаснут, но остаются в документе', () => {
    render(
      <Timeline roles={roles} selected={['electron']} locale="en" now={NOW} />
    )
    expect(screen.getByTestId('role-dstar-lab')).toHaveAttribute(
      'data-dimmed',
      'false'
    )
    expect(screen.getByTestId('role-wirex')).toHaveAttribute(
      'data-dimmed',
      'true'
    )
    expect(screen.getAllByRole('article')).toHaveLength(roles.length)
  })
})
