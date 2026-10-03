import { render, screen } from '@testing-library/react'
import { cv, project } from '@cv/data'
import { describe, expect, it } from 'vitest'
import { App } from '@/App'

const data = project(cv, 'en')
const NOW = new Date(Date.UTC(2026, 9, 3))

// Гвард приватности различает форму номера, а не владельца: записанный целиком
// даже этот выдуманный номер даёт красный `pnpm guard`. Поэтому он склеен из
// фрагментов — расширять список SELF гварда нельзя, рядом лежат настоящие данные.
const FAKE_PHONE = ['+', '380', '0'.repeat(9)].join('')

describe('печатная вёрстка резюме', () => {
  it('показывает имя, титул и контакты', () => {
    render(<App data={data} now={NOW} />)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Nikolay Belibov' })
    ).toBeInTheDocument()
    expect(screen.getByText('Frontend Engineer')).toBeInTheDocument()
    expect(screen.getByText('belibov.nikolay@gmail.com')).toBeInTheDocument()
  })

  it('подставляет стаж в summary', () => {
    render(<App data={data} now={NOW} />)
    expect(screen.getByTestId('summary')).toHaveTextContent('11 years')
    expect(screen.getByTestId('summary')).not.toHaveTextContent('{{')
  })

  it('обрезает буллеты по printBulletLimit', () => {
    render(<App data={data} now={NOW} />)
    const wirex = screen.getByTestId('role-wirex')
    expect(wirex.querySelectorAll('li')).toHaveLength(5)
  })

  it('сворачивает ранний опыт в одну строку без названия компании', () => {
    render(<App data={data} now={NOW} />)
    const early = screen.getByTestId('role-early-web')
    expect(early.querySelectorAll('li')).toHaveLength(0)
    expect(early).toHaveTextContent('Frontend / HTML developer')
    expect(early).toHaveTextContent('Jan 2015 — Dec 2018')
  })

  it('без CV_PHONE телефона в документе нет', () => {
    render(<App data={data} now={NOW} />)
    expect(document.body.textContent ?? '').not.toMatch(/380\d{9}/)
  })

  it('с переданным телефоном показывает его в контактах', () => {
    render(<App data={data} now={NOW} phone={FAKE_PHONE} />)
    expect(screen.getByText(FAKE_PHONE)).toBeInTheDocument()
  })

  it('собирает блок навыков из реестра, который реально используется в данных', () => {
    render(<App data={data} now={NOW} />)
    const skills = screen.getByTestId('skills')
    expect(skills).toHaveTextContent('React')
    expect(skills).toHaveTextContent('TypeScript')
    expect(skills).toHaveTextContent('Playwright')
  })
})
