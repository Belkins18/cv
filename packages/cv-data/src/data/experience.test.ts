import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { cvSchema } from '../schema'
import { totalExperienceYears } from '../derive'
import { applyTokens } from '../tokens'
import { contacts, profile } from './profile'
import { roles } from './experience'
import {
  FORBIDDEN_CONTENT,
  FORBIDDEN_IN_RESUME,
  PHONE
} from '../../../../tools/repo-guard/patterns'

const NOW = new Date(Date.UTC(2026, 9, 3))
const rolesSchema = cvSchema.shape.roles

describe('the experience dataset', () => {
  it('passes the schema', () => {
    expect(() => rolesSchema.parse(roles)).not.toThrow()
  })

  it('runs from the newest role to the oldest', () => {
    const starts = roles.map((r) => r.period.start)
    expect([...starts].sort().reverse()).toEqual(starts)
  })

  it('derives 11 years from the earliest role as of October 2026', () => {
    expect(totalExperienceYears(roles, NOW)).toBe(11)
  })

  it('folds everything before 2019 into one line with no company name', () => {
    const compact = roles.filter((r) => r.detail === 'compact')
    expect(compact).toHaveLength(1)
    expect(compact[0]?.company).toBeUndefined()
    expect(compact[0]?.period.end).toBe('2018-12')
  })

  /*
   * Every role since September 2021 was placed by the same outstaffing company.
   * That thread is what makes three short client projects read as one continuous
   * employment instead of job-hopping, and it is the only thing that squares the
   * resume with the LinkedIn profile, where the company is listed from 2021.
   *
   * It is carried in `location` and nowhere else: as a role of its own it looked
   * like parallel jobs — the comment on `poollotto` records that finding for
   * Extrawest. No type holds the thread, so it can be dropped from a role in
   * total silence.
   */
  it.each(['wirex', 'cbs-tech', 'bidflyer', 'poollotto', 'ownix'])(
    'names the company that placed the role: %s',
    (id) => {
      const role = roles.find((r) => r.id === id)

      expect(role?.location?.en).toContain('SixthSense Technology')
      expect(role?.location?.uk).toContain('SixthSense Technology')
    }
  )

  /*
   * Extrawest was the employer for the first two roles only, and the resume says
   * so rather than flattening both agencies into one. Dropping it would leave the
   * entry point unexplained; spreading it further would claim a relationship that
   * ended in March 2022.
   */
  it.each(['poollotto', 'ownix'])(
    'keeps the employer that was the entry point: %s',
    (id) => {
      expect(roles.find((r) => r.id === id)?.location?.en).toContain(
        'Extrawest'
      )
    }
  )

  // The dictionary of what is forbidden lives in tools/repo-guard/patterns.ts and
  // is imported from there: a copy of a pattern that turns out softer than the
  // original is not a duplicate, it is a hole. Test titles are scanned by the
  // guard too, so the name is filled in by it.each rather than spelled out here.
  it.each(FORBIDDEN_IN_RESUME)('does not contain: %s', (_label, pattern) => {
    expect(JSON.stringify(roles)).not.toMatch(pattern)
  })

  it.each(FORBIDDEN_CONTENT)('does not contain: %s', (_label, pattern) => {
    expect(JSON.stringify(roles)).not.toMatch(pattern)
  })
})

describe('the profile', () => {
  it('passes the schema', () => {
    expect(() =>
      z
        .object({
          profile: cvSchema.shape.profile,
          contacts: cvSchema.shape.contacts
        })
        .parse({ profile, contacts })
    ).not.toThrow()
  })

  it('carries no phone number: it is injected only by the PDF build', () => {
    expect(JSON.stringify(contacts)).not.toMatch(PHONE)
  })

  it('renders the summary with the current years and leaves no raw tokens', () => {
    const years = totalExperienceYears(roles, NOW)
    const rendered = applyTokens(profile.summary.en, { years })
    expect(rendered).toContain('11 years')
    expect(rendered).not.toContain('{{')
  })
})
