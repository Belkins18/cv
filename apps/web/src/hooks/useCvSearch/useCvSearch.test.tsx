import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { readStored } from '@/state/preferences'
import { renderWithRouter } from '@/test-utils/renderWithRouter'
import { useCvSearch } from './useCvSearch'

/*
 * Побочные эффекты хука — запись в `<html>` и в хранилище — не покрывались
 * ничем: подмена записываемого значения оставляла все гейты зелёными и тихо
 * ломала тему у всех, кто не выбирал её руками. Зонд существует ради них.
 */
const Probe = () => {
  const { locale, themeMode, setLocale, setThemeMode } = useCvSearch()
  return (
    <div>
      <output>{`${locale}/${themeMode}`}</output>
      <button type="button" onClick={() => setLocale('uk')}>
        язык
      </button>
      <button type="button" onClick={() => setThemeMode('dark')}>
        тема
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
  describe('тема в DOM', () => {
    it('в режиме system не ставит data-theme вовсе — ветку выбирает CSS', async () => {
      renderProbe()
      expect(await screen.findByText('en/system')).toBeInTheDocument()
      expect(document.documentElement).not.toHaveAttribute('data-theme')
    })

    it.each(['light', 'dark'] as const)(
      'явный выбор пишется атрибутом: %s',
      async (mode) => {
        renderProbe(`/?theme=${mode}`)
        expect(await screen.findByText(`en/${mode}`)).toBeInTheDocument()
        expect(document.documentElement).toHaveAttribute('data-theme', mode)
      }
    )

    it('возврат к system снимает ранее поставленный атрибут', async () => {
      const { unmount } = renderProbe('/?theme=dark')
      expect(await screen.findByText('en/dark')).toBeInTheDocument()
      unmount()

      renderProbe('/?theme=system')
      expect(await screen.findByText('en/system')).toBeInTheDocument()
      expect(document.documentElement).not.toHaveAttribute('data-theme')
    })
  })

  it('локаль уезжает в lang у <html> — без него скринридер читает украинский по-английски', async () => {
    renderProbe('/?lang=uk')
    expect(await screen.findByText('uk/system')).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('uk')
  })

  describe('хранилище', () => {
    it('выведенная локаль не сохраняется: ветка «язык браузера» обязана остаться живой', async () => {
      renderProbe()
      expect(await screen.findByText('en/system')).toBeInTheDocument()
      expect(readStored()).toEqual({})
    })

    it('локаль из ссылки не сохраняется: её выбрал отправитель, а не читатель', async () => {
      renderProbe('/?lang=uk&theme=dark')
      expect(await screen.findByText('uk/dark')).toBeInTheDocument()
      expect(readStored()).toEqual({})
    })

    it('нажатие на кнопку — сохраняется', async () => {
      const user = userEvent.setup()
      renderProbe()
      await user.click(await screen.findByRole('button', { name: 'язык' }))
      expect(readStored()).toEqual({ lang: 'uk' })

      await user.click(screen.getByRole('button', { name: 'тема' }))
      // Второй выбор не затирает первый.
      expect(readStored()).toEqual({ lang: 'uk', theme: 'dark' })
    })
  })

  /*
   * Прямое доказательство того, ради чего чинилось чтение хранилища:
   * битая запись больше не доезжает до loadCv и не оставляет посетителя
   * с мёртвой страницей, которую нечем вылечить.
   */
  it('битое хранилище не уводит локаль в несуществующую', async () => {
    window.localStorage.setItem(
      'cv.preferences',
      '{"lang":"zz","theme":"banana"}'
    )
    renderProbe()
    expect(await screen.findByText('en/system')).toBeInTheDocument()
  })
})
