import * as cvData from '@cv/data'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithRouter } from '@/test-utils/renderWithRouter'
import { reloadPage } from '@/utils/reloadPage'
import { HomePage } from './HomePage'

vi.mock('@cv/data', async (importOriginal) => {
  const actual = await importOriginal<typeof cvData>()
  return { ...actual, loadCv: vi.fn() }
})

// The module is mocked rather than window.location: in jsdom location is
// unforgeable, so reload cannot be replaced on it by spyOn or defineProperty.
vi.mock('@/utils/reloadPage', () => ({ reloadPage: vi.fn() }))

const loadCv = vi.mocked(cvData.loadCv)
const reload = vi.mocked(reloadPage)

const renderPage = (path?: string) =>
  renderWithRouter(<HomePage />, path === undefined ? {} : { path })

beforeEach(() => {
  loadCv.mockReset()
  reload.mockReset()
})

describe('HomePage', () => {
  // findBy rather than getBy: RouterProvider matches the route after the first
  // render, so synchronously the document is still empty. The assertion is the same.
  it('shows a skeleton with a screen-reader status while the data is in flight', async () => {
    loadCv.mockReturnValue(new Promise(() => undefined))
    renderPage()
    expect(await screen.findByRole('status')).toBeInTheDocument()
  })

  it('shows a message and a retry button on failure, not a blank page', async () => {
    loadCv.mockRejectedValue(new cvData.CvDataError('en', new Error('offline')))
    renderPage()
    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
  })

  /*
   * Retry reloads the page instead of repeating the request. The reason lives in
   * the browser and cannot be reproduced in jsdom: a failed dynamic `import()`
   * is remembered in the module map, and the next import of the same URL fails
   * without going to the network. Uncovered by the e2e scenario where the chunk
   * fails to load: after that failure there is not one further request for it.
   * What is checked here is the button's contract.
   */
  it('reloads the page on retry instead of poking an import that is already dead', async () => {
    loadCv.mockRejectedValue(new cvData.CvDataError('en', new Error('offline')))
    const user = userEvent.setup()
    renderPage()
    await user.click(await screen.findByRole('button', { name: /retry/i }))
    expect(reload).toHaveBeenCalledTimes(1)
    // The loader was not called a second time: a refetch here would be an empty gesture.
    expect(loadCv).toHaveBeenCalledTimes(1)
  })

  it('renders the CV once the data arrives', async () => {
    loadCv.mockResolvedValue(cvData.project(cvData.cv, 'en'))
    renderPage()
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Nikolay Belibov' })
    ).toBeInTheDocument()
  })

  // People hand-edit links and messengers mangle them. A white screen here costs
  // an application.
  it('opens with junk in the search params and keeps the valid part of the filter', async () => {
    loadCv.mockResolvedValue(cvData.project(cvData.cv, 'en'))
    renderPage('/?tech=react,drogon,,REACT&lang=fr')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Nikolay Belibov' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('checkbox', { name: /^React\s*\d+$/ })
    ).toBeChecked()
    // lang=fr is not a locale of this CV: the language falls back to English.
    expect(loadCv).toHaveBeenCalledWith('en')
  })

  /*
   * The empty-filter hint promises that "the cards below are all dimmed". The
   * match count runs over roles and projects alike, so the promise only becomes
   * true when the page holds both.
   */
  it('dims roles and projects alike for a stack that appears nowhere', async () => {
    loadCv.mockResolvedValue(cvData.project(cvData.cv, 'en'))
    renderPage('/?tech=solana,tron')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Nikolay Belibov' })
    ).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(/nothing matches/i)

    const roles = screen.getAllByTestId(/^role-/)
    const projects = screen.getAllByTestId(/^project-/)
    expect(roles.length).toBeGreaterThan(0)
    expect(projects.length).toBeGreaterThan(0)
    for (const card of [...roles, ...projects]) {
      expect(card).toHaveAttribute('data-dimmed', 'true')
    }
  })

  /*
   * The locale in the URL drives both the data and the chrome. This test comes
   * last in the file: the i18next language is global state for the whole run, and
   * switching it halfway through a file whose other assertions are written in
   * English would take them down one by one.
   */
  it('translates the button labels too, not just the data, under the Ukrainian locale', async () => {
    loadCv.mockResolvedValue(cvData.project(cvData.cv, 'uk'))
    renderPage('/?lang=uk')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Nikolay Belibov' })
    ).toBeInTheDocument()
    expect(loadCv).toHaveBeenCalledWith('uk')
    expect(
      await screen.findByRole('link', { name: 'Завантажити PDF' })
    ).toBeInTheDocument()
    expect(await screen.findByText('Досвід')).toBeInTheDocument()
    expect(screen.getByText('Проєкти')).toBeInTheDocument()
  })
})
