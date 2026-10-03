import { describe, expect, it } from 'vitest'
import { cvSchema } from '../schema'
import { TECH_IDS } from '../tech'
import { cv } from './index'

describe('полный документ резюме', () => {
  it('проходит схему целиком', () => {
    expect(() => cvSchema.parse(cv)).not.toThrow()
  })

  it('содержит оба сертификата SULICOM с идентификаторами аккредитации', () => {
    expect(cv.certificates.map((c) => c.credentialId).sort()).toEqual([
      'WS-H8QWKJ6RY7',
      'WS-H9H3Q73NRE'
    ])
  })

  it('содержит три ступени образования', () => {
    expect(cv.education).toHaveLength(3)
  })

  it('PDF Creator описан как проект без публичной ссылки', () => {
    const pdfCreator = cv.projects.find((p) => p.id === 'pdf-creator')
    expect(pdfCreator).toBeDefined()
    expect(pdfCreator?.url).toBeUndefined()
  })

  it('у публичных проектов ссылки ведут на https', () => {
    for (const project of cv.projects) {
      if (project.url !== undefined) expect(project.url).toMatch(/^https:\/\//)
    }
  })

  it('каждая технология из реестра, упомянутая в данных, существует', () => {
    const used = new Set([...cv.roles, ...cv.projects].flatMap((e) => e.tech))
    for (const id of used) expect(TECH_IDS).toContain(id)
  })
})
