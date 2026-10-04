import { cv, project } from '@cv/data'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
// The one dictionary of forbidden strings lives in the guard: a copy of a
// pattern inside a test would sooner or later drift away from the original and
// become a hole (00-constraints).
import { PHONE } from '../../../../../tools/repo-guard/patterns'
import { Rail } from './Rail'

const data = project(cv, 'en')

describe('Rail', () => {
  it('shows the contacts without a phone number', () => {
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

  it('offers a link to the PDF', () => {
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

  it('switches the language and cycles through the themes', async () => {
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

  it('returns to system mode from dark', async () => {
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
