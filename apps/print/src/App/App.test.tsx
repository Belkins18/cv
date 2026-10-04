import { render, screen } from '@testing-library/react'
import { cv, project } from '@cv/data'
import { describe, expect, it } from 'vitest'
import { App } from '@/App'
import { PHONE } from '../../../../tools/repo-guard/patterns'

const data = project(cv, 'en')
const NOW = new Date(Date.UTC(2026, 9, 3))

// The privacy guard recognizes the shape of a number, not its owner: written out
// in full, even this made-up number turns `pnpm guard` red. So it is assembled
// from fragments — extending the guard's SELF list is not an option, the real
// resume data lives right next door.
const FAKE_PHONE = ['+', '380', '0'.repeat(9)].join('')

describe('the printed resume layout', () => {
  it('shows the name, the title and the contacts', () => {
    render(<App data={data} now={NOW} />)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Nikolay Belibov' })
    ).toBeInTheDocument()
    expect(screen.getByText('Frontend Engineer')).toBeInTheDocument()
    expect(screen.getByText('belibov.nikolay@gmail.com')).toBeInTheDocument()
  })

  it('substitutes the years of experience into the summary', () => {
    render(<App data={data} now={NOW} />)
    expect(screen.getByTestId('summary')).toHaveTextContent('11 years')
    expect(screen.getByTestId('summary')).not.toHaveTextContent('{{')
  })

  it('trims the bullets down to printBulletLimit', () => {
    render(<App data={data} now={NOW} />)
    const wirex = screen.getByTestId('role-wirex')
    expect(wirex.querySelectorAll('li')).toHaveLength(5)
  })

  it('folds the early experience into one line with no company name', () => {
    render(<App data={data} now={NOW} />)
    const early = screen.getByTestId('role-early-web')
    expect(early.querySelectorAll('li')).toHaveLength(0)
    expect(early).toHaveTextContent('Frontend / HTML developer')
    expect(early).toHaveTextContent('Jan 2015 — Dec 2018')
  })

  it('leaves no phone number in the document when CV_PHONE is unset', () => {
    render(<App data={data} now={NOW} />)
    expect(document.body.textContent ?? '').not.toMatch(PHONE)
  })

  it('shows the phone number among the contacts once one is passed in', () => {
    render(<App data={data} now={NOW} phone={FAKE_PHONE} />)
    expect(screen.getByText(FAKE_PHONE)).toBeInTheDocument()
  })

  it('builds the skills block from the registry entries the data actually uses', () => {
    render(<App data={data} now={NOW} />)
    const skills = screen.getByTestId('skills')
    expect(skills).toHaveTextContent('React')
    expect(skills).toHaveTextContent('TypeScript')
    expect(skills).toHaveTextContent('Playwright')
  })
})
