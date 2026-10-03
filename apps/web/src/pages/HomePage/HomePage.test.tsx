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

const renderPage = (path?: string) =>
  renderWithRouter(<HomePage />, path === undefined ? {} : { path })

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

  // Ссылку правит человек и ломает мессенджер. Белый экран здесь — потеря отклика.
  it('открывается с мусором в search-параметрах, оставив валидную часть фильтра', async () => {
    loadCv.mockResolvedValue(cvData.project(cvData.cv, 'en'))
    renderPage('/?tech=react,drogon,,REACT&lang=fr')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Nikolay Belibov' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('checkbox', { name: /^React\s*\d+$/ })
    ).toBeChecked()
    // lang=fr — не локаль этого резюме: язык гасится до английского по умолчанию.
    expect(loadCv).toHaveBeenCalledWith('en')
  })

  /*
   * Подсказка пустого фильтра обещает, что погашены «все карточки ниже».
   * Счётчик совпадений считается по ролям и проектам, поэтому обещание
   * становится правдой только когда на странице есть и те, и другие.
   */
  it('при стеке, которого нет нигде, гасит и роли, и проекты', async () => {
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
   * Локаль в URL ведёт и данные, и хром. Тест идёт последним в файле: язык
   * i18next — глобальное состояние прогона, и переключать его посреди файла,
   * где остальные проверки написаны по-английски, значит ронять их по очереди.
   */
  it('при украинской локали переводит не только данные, но и подписи кнопок', async () => {
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
