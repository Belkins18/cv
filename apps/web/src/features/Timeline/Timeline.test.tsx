import { cv, project } from '@cv/data'
import { render, screen, within } from '@testing-library/react'
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

  /*
   * Конституция держит опыт до 2019 одной строкой `detail: "compact"` без
   * буллетов. Раскрывать там нечего, поэтому и кнопки быть не должно: иначе
   * `aria-controls` указывает в несуществующую панель, а скринридер объявляет
   * «свёрнуто» там, где нажатие ничего не делает.
   */
  it('карточке без буллетов не даёт кнопку, указывающую в пустоту', () => {
    render(<Timeline roles={roles} selected={[]} locale="en" now={NOW} />)
    const early = screen.getByTestId('role-early-web')
    expect(early).toHaveTextContent('Frontend / HTML developer')
    expect(within(early).queryByRole('button')).not.toBeInTheDocument()
    expect(early.querySelector('[aria-controls]')).toBeNull()
  })

  it('раскрываемой карточке кнопку даёт, и она действительно раскрывает', async () => {
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
   * Страна есть в PDF и обязана быть на сайте: без неё читатель не понимает,
   * что ownix и Poollotto были израильскими.
   */
  it('показывает страну роли, как её показывает PDF', () => {
    render(<Timeline roles={roles} selected={[]} locale="en" now={NOW} />)
    expect(screen.getByTestId('role-wirex')).toHaveTextContent(
      'Israel / USA · remote'
    )
    expect(screen.getByTestId('role-ownix')).toHaveTextContent('Israel')
    expect(screen.getByTestId('role-poollotto')).toHaveTextContent('Israel')
  })
})
