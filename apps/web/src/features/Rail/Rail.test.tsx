import { cv, project } from '@cv/data'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
// Единственный словарь запрещённого живёт в гварде: копия паттерна в тесте
// рано или поздно разъедется с оригиналом и станет дырой (00-constraints).
import { PHONE } from '../../../../../tools/repo-guard/patterns'
import { Rail } from './Rail'

const data = project(cv, 'en')

describe('Rail', () => {
  it('показывает контакты без телефона', () => {
    render(
      <Rail
        data={data}
        locale="en"
        themeMode="system"
        onLocale={vi.fn()}
        onThemeMode={vi.fn()}
      />
    )
    expect(screen.getByText('belibov.nikolay@gmail.com')).toBeInTheDocument()
    expect(document.body.textContent ?? '').not.toMatch(PHONE)
  })

  it('даёт ссылку на PDF', () => {
    render(
      <Rail
        data={data}
        locale="en"
        themeMode="system"
        onLocale={vi.fn()}
        onThemeMode={vi.fn()}
      />
    )
    expect(screen.getByRole('link', { name: /download pdf/i })).toHaveAttribute(
      'href',
      '/cv-nikolay-belibov.pdf'
    )
  })

  it('переключает язык, а тему перебирает по кругу', async () => {
    const onLocale = vi.fn()
    const onThemeMode = vi.fn()
    const user = userEvent.setup()
    render(
      <Rail
        data={data}
        locale="en"
        themeMode="system"
        onLocale={onLocale}
        onThemeMode={onThemeMode}
      />
    )
    await user.click(screen.getByRole('button', { name: /switch language/i }))
    await user.click(screen.getByRole('button', { name: /switch theme/i }))
    expect(onLocale).toHaveBeenCalledWith('uk')
    expect(onThemeMode).toHaveBeenCalledWith('light')
  })

  it('из режима dark возвращается в system', async () => {
    const onThemeMode = vi.fn()
    const user = userEvent.setup()
    render(
      <Rail
        data={data}
        locale="en"
        themeMode="dark"
        onLocale={vi.fn()}
        onThemeMode={onThemeMode}
      />
    )
    await user.click(screen.getByRole('button', { name: /switch theme/i }))
    expect(onThemeMode).toHaveBeenCalledWith('system')
  })
})
