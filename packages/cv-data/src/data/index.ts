import { cvSchema, type Cv } from '../schema'
import { contacts, profile } from './profile'
import { roles } from './experience'
import { projects } from './projects'
import { certificates, education, languages } from './education'

/** The single source of truth. Validated on import: broken data never reaches a render. */
export const cv: Cv = cvSchema.parse({
  profile,
  contacts,
  roles,
  projects,
  certificates,
  education,
  languages
})
