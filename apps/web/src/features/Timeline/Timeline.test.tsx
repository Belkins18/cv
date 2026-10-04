import { cv, project } from '@cv/data'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Timeline } from './Timeline'

const roles = project(cv, 'en').roles
const NOW = new Date(Date.UTC(2026, 9, 3))

describe('Timeline', () => {
  it('shows every role, collapsed by default', () => {
    render(<Timeline roles={roles} selected={[]} locale="en" now={NOW} />)
    expect(screen.getAllByRole('article')).toHaveLength(roles.length)
    expect(screen.queryByText(/manifest-driven/i)).not.toBeInTheDocument()
  })

  it('expands a role on click', async () => {
    const user = userEvent.setup()
    render(<Timeline roles={roles} selected={[]} locale="en" now={NOW} />)
    await user.click(screen.getByRole('button', { name: /WireX Systems/ }))
    expect(screen.getByText(/manifest-driven/i)).toBeInTheDocument()
  })

  it('shows the period and the duration', () => {
    render(<Timeline roles={roles} selected={[]} locale="en" now={NOW} />)
    const wirex = screen.getByTestId('role-wirex')
    expect(wirex).toHaveTextContent('Jun 2024 — Present')
    expect(wirex).toHaveTextContent('2 yr 5 mo')
  })

  it('dims the roles that do not match the filter but keeps them in the document', () => {
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

  /*
   * The project's rules keep everything before 2019 as a single
   * `detail: "compact"` line with no bullets. There is nothing to expand there,
   * so there must be no button either: otherwise `aria-controls` points at a
   * panel that does not exist and a screen reader announces "collapsed" where
   * pressing does nothing.
   */
  it('gives a bullet-less card no button pointing into the void', () => {
    render(<Timeline roles={roles} selected={[]} locale="en" now={NOW} />)
    const early = screen.getByTestId('role-early-web')
    expect(early).toHaveTextContent('Frontend / HTML developer')
    expect(within(early).queryByRole('button')).not.toBeInTheDocument()
    expect(early.querySelector('[aria-controls]')).toBeNull()
  })

  it('gives an expandable card a button that really does expand it', async () => {
    const user = userEvent.setup()
    render(<Timeline roles={roles} selected={[]} locale="en" now={NOW} />)
    const wirex = screen.getByTestId('role-wirex')
    const toggle = within(wirex).getByRole('button')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    const panelId = toggle.getAttribute('aria-controls')
    expect(panelId).not.toBeNull()
    expect(document.getElementById(panelId ?? '')).toBeInTheDocument()
  })

  /*
   * The country is in the PDF and has to be on the site: without it the reader
   * has no way of knowing that ownix and Poollotto were Israeli.
   */
  it('shows the country of a role the way the PDF shows it', () => {
    render(<Timeline roles={roles} selected={[]} locale="en" now={NOW} />)
    expect(screen.getByTestId('role-wirex')).toHaveTextContent(
      'Israel / USA · remote'
    )
    expect(screen.getByTestId('role-ownix')).toHaveTextContent('Israel')
    expect(screen.getByTestId('role-poollotto')).toHaveTextContent('Israel')
  })
})
