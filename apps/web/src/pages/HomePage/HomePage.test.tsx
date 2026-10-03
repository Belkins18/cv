import * as cvData from '@cv/data'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithRouter } from '@/test-utils/renderWithRouter'
import { HomePage } from './HomePage'

vi.mock('@cv/data', async (importOriginal) => {
  const actual = await importOriginal<typeof cvData>()
  return { ...actual, loadCv: vi.fn() }
})

const loadCv = vi.mocked(cvData.loadCv)

const renderPage = () => renderWithRouter(<HomePage />)

beforeEach(() => {
  loadCv.mockReset()
})

describe('HomePage', () => {
  // findBy, а не getBy: RouterProvider подбирает маршрут после первого рендера,
  // поэтому синхронно в документе ещё пусто. Проверяется то же самое.
  it('пока данные едут, показывает скелетон со статусом для скринридера', async () => {
    loadCv.mockReturnValue(new Promise(() => undefined))
    renderPage()
    expect(await screen.findByRole('status')).toBeInTheDocument()
  })

  it('на ошибке показывает сообщение и кнопку повтора, а не пустую страницу', async () => {
    loadCv.mockRejectedValue(new cvData.CvDataError('en', new Error('offline')))
    renderPage()
    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /retry|повтор/i })
    ).toBeInTheDocument()
  })

  it('повтор запускает загрузку заново', async () => {
    loadCv.mockRejectedValueOnce(
      new cvData.CvDataError('en', new Error('offline'))
    )
    loadCv.mockResolvedValueOnce(cvData.project(cvData.cv, 'en'))
    const user = userEvent.setup()
    renderPage()
    await user.click(
      await screen.findByRole('button', { name: /retry|повтор/i })
    )
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Nikolay Belibov' })
    ).toBeInTheDocument()
  })

  it('на успехе рендерит резюме', async () => {
    loadCv.mockResolvedValue(cvData.project(cvData.cv, 'en'))
    renderPage()
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Nikolay Belibov' })
    ).toBeInTheDocument()
  })
})
