import { cv, project } from '@cv/data'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Projects } from './Projects'

const projects = project(cv, 'en').projects

describe('Projects', () => {
  it('даёт рабочие ссылки на публичные проекты', () => {
    render(<Projects projects={projects} selected={[]} />)
    expect(
      screen.getByRole('link', { name: /vibr-clan-statistics/ })
    ).toHaveAttribute('href', 'https://vibr-clan-statistics.netlify.app/hydra')
  })

  it('внутренний продукт показывает без ссылки', () => {
    render(<Projects projects={projects} selected={[]} />)
    expect(
      screen.getByTestId('project-pdf-creator').querySelector('a')
    ).toBeNull()
  })

  it('гасит проекты вне фильтра, не убирая их', () => {
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
