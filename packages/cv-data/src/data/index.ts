import { cvSchema, type Cv } from '../schema'
import { contacts, profile } from './profile'
import { roles } from './experience'
import { projects } from './projects'
import { certificates, education, languages } from './education'

/** Единственный источник правды. Валидируется при импорте: битые данные не доживут до рендера. */
export const cv: Cv = cvSchema.parse({
  profile,
  contacts,
  roles,
  projects,
  certificates,
  education,
  languages
})
