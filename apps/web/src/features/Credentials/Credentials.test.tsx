import { cv, project } from '@cv/data'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Credentials } from './Credentials'

const data = project(cv, 'en')

const renderCredentials = () =>
  render(
    <Credentials
      certificates={data.certificates}
      education={data.education}
      languages={data.languages}
    />
  )

describe('Credentials', () => {
  it('даёт проверяемые ссылки на сертификаты', () => {
    renderCredentials()
    expect(
      screen.getByRole('link', { name: /Harness Engineering/ })
    ).toHaveAttribute(
      'href',
      'https://certificates.sulicom.tech/c/95703143b432942ae1c1f3c72df2cce4'
    )
  })

  it('перечисляет три ступени образования и три языка', () => {
    renderCredentials()
    expect(screen.getAllByTestId(/^education-/)).toHaveLength(3)
    expect(screen.getAllByTestId(/^language-/)).toHaveLength(3)
  })
})
