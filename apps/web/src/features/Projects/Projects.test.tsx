import { cv, project } from '@cv/data'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Projects } from './Projects'

const projects = project(cv, 'en').projects

describe('Projects', () => {
  it('gives working links to the public projects', () => {
    render(<Projects projects={projects} selected={[]} />)
    expect(
      screen.getByRole('link', { name: /vibr-clan-statistics/ })
    ).toHaveAttribute('href', 'https://vibr-clan-statistics.netlify.app/hydra')
  })

  it('shows an internal product without a link', () => {
    render(<Projects projects={projects} selected={[]} />)
    expect(
      screen.getByTestId('project-pdf-creator').querySelector('a')
    ).toBeNull()
  })

  it('dims the projects outside the filter without removing them', () => {
    render(<Projects projects={projects} selected={['supabase']} />)
    expect(screen.getByTestId('project-easyfop')).toHaveAttribute(
      'data-dimmed',
      'false'
    )
    expect(screen.getByTestId('project-vibr')).toHaveAttribute(
      'data-dimmed',
      'true'
    )
  })
})
