import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { readStored } from '@/state/preferences'
import { renderWithRouter } from '@/test-utils/renderWithRouter'
import { useCvSearch } from './useCvSearch'

/*
 * The hook's side effects — what it writes to `<html>` and to storage — were
 * covered by nothing: changing the written value left every gate green while
 * quietly breaking the theme for everyone who had not picked one by hand. This
 * probe exists for them.
 */
const Probe = () => {
  const { locale, themeMode, setLocale, setThemeMode } = useCvSearch()
  return (
    <div>
      <output>{`${locale}/${themeMode}`}</output>
      <button type="button" onClick={() => setLocale('uk')}>
        language
      </button>
      <button type="button" onClick={() => setThemeMode('dark')}>
        theme
      </button>
    </div>
  )
}

const renderProbe = (path = '/') => renderWithRouter(<Probe />, { path })

afterEach(() => {
  window.localStorage.clear()
  delete document.documentElement.dataset['theme']
})

describe('useCvSearch', () => {
  describe('the theme in the DOM', () => {
    it('writes no data-theme at all in system mode, leaving the branch to CSS', async () => {
      renderProbe()
      expect(await screen.findByText('en/system')).toBeInTheDocument()
      expect(document.documentElement).not.toHaveAttribute('data-theme')
    })

    it.each(['light', 'dark'] as const)(
      'writes an explicit choice as an attribute: %s',
      async (mode) => {
        renderProbe(`/?theme=${mode}`)
        expect(await screen.findByText(`en/${mode}`)).toBeInTheDocument()
        expect(document.documentElement).toHaveAttribute('data-theme', mode)
      }
    )

    it('removes a previously written attribute when the choice returns to system', async () => {
      const { unmount } = renderProbe('/?theme=dark')
      expect(await screen.findByText('en/dark')).toBeInTheDocument()
      unmount()

      renderProbe('/?theme=system')
      expect(await screen.findByText('en/system')).toBeInTheDocument()
      expect(document.documentElement).not.toHaveAttribute('data-theme')
    })
  })

  it('puts the locale into the lang of <html>, without which a screen reader reads Ukrainian as English', async () => {
    renderProbe('/?lang=uk')
    expect(await screen.findByText('uk/system')).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('uk')
  })

  describe('storage', () => {
    it('does not store an inferred locale, so the "browser language" branch stays alive', async () => {
      renderProbe()
      expect(await screen.findByText('en/system')).toBeInTheDocument()
      expect(readStored()).toEqual({})
    })

    it('does not store a locale that came from the link: the sender chose it, not the reader', async () => {
      renderProbe('/?lang=uk&theme=dark')
      expect(await screen.findByText('uk/dark')).toBeInTheDocument()
      expect(readStored()).toEqual({})
    })

    it('stores what the visitor clicked', async () => {
      const user = userEvent.setup()
      renderProbe()
      await user.click(await screen.findByRole('button', { name: 'language' }))
      expect(readStored()).toEqual({ lang: 'uk' })

      await user.click(screen.getByRole('button', { name: 'theme' }))
      // The second choice does not overwrite the first.
      expect(readStored()).toEqual({ lang: 'uk', theme: 'dark' })
    })
  })

  /*
   * Direct proof of what reading storage was fixed for: a broken entry no longer
   * reaches loadCv and no longer leaves the visitor on a dead page with nothing
   * to cure it.
   */
  it('does not let broken storage push the locale to one that does not exist', async () => {
    window.localStorage.setItem(
      'cv.preferences',
      '{"lang":"zz","theme":"banana"}'
    )
    renderProbe()
    expect(await screen.findByText('en/system')).toBeInTheDocument()
  })
})
