import { describe, expect, it } from 'vitest'
import { cvSchema } from '../schema'
import { TECH_IDS } from '../tech'
import { cv } from './index'

describe('the full CV document', () => {
  it('passes the schema as a whole', () => {
    expect(() => cvSchema.parse(cv)).not.toThrow()
  })

  it('carries both SULICOM certificates with their credential ids', () => {
    expect(cv.certificates.map((c) => c.credentialId).sort()).toEqual([
      'WS-H8QWKJ6RY7',
      'WS-H9H3Q73NRE'
    ])
  })

  it('carries three education entries', () => {
    expect(cv.education).toHaveLength(3)
  })

  it('describes PDF Creator as a project with no public link', () => {
    const pdfCreator = cv.projects.find((p) => p.id === 'pdf-creator')
    expect(pdfCreator).toBeDefined()
    expect(pdfCreator?.url).toBeUndefined()
  })

  it('keeps every public project link on https', () => {
    for (const project of cv.projects) {
      if (project.url !== undefined) expect(project.url).toMatch(/^https:\/\//)
    }
  })

  it('references only technologies that exist in the registry', () => {
    const used = new Set([...cv.roles, ...cv.projects].flatMap((e) => e.tech))
    for (const id of used) expect(TECH_IDS).toContain(id)
  })
})
