import {
  applyTokens,
  formatPeriod,
  TECH,
  totalExperienceYears,
  visibleRoles,
  type ResolvedCv,
  type TechGroup,
  type TechId
} from '@cv/data'

// phone объявлен как `string | undefined`, а не `phone?: string`: при
// exactOptionalPropertyTypes передать явный undefined в необязательное поле нельзя,
// а main.tsx читает его из окружения и именно undefined и получает.
type Props = { data: ResolvedCv; now: Date; phone?: string | undefined }

const GROUP_ORDER: readonly TechGroup[] = [
  'core',
  'state',
  'ui',
  'tooling',
  'testing',
  'backend',
  'web3',
  'legacy'
]

const GROUP_LABEL: Record<TechGroup, string> = {
  core: 'Core',
  state: 'Data & routing',
  ui: 'UI',
  tooling: 'Tooling',
  testing: 'Testing',
  backend: 'Backend & desktop',
  web3: 'Web3',
  legacy: 'Also worked with'
}

/** Список навыков выводится из данных: технология без роли и проекта в резюме не появляется. */
const usedTech = (data: ResolvedCv): TechId[] => {
  const used = new Set<TechId>()
  for (const entry of [...data.roles, ...data.projects]) {
    for (const id of entry.tech) used.add(id)
  }
  return [...used]
}

export const App = ({ data, now, phone }: Props) => {
  const years = totalExperienceYears(data.roles, now)
  const roles = visibleRoles(data.roles)
  const tech = usedTech(data)

  return (
    <main className="sheet">
      <header className="header">
        <h1>{data.profile.name}</h1>
        <p className="title">{data.profile.title}</p>
        <p className="contacts">
          <span>{data.contacts.email}</span>
          {phone !== undefined && phone !== '' && <span>{phone}</span>}
          <span>{data.contacts.telegram}</span>
          <span>{data.contacts.linkedin.replace('https://www.', '')}</span>
          <span>{data.contacts.github.replace('https://', '')}</span>
          <span>{data.contacts.location}</span>
        </p>
      </header>

      <section className="section">
        <p data-testid="summary" className="summary">
          {applyTokens(data.profile.summary, { years })}
        </p>
      </section>

      <section className="section" data-testid="skills">
        <h2>Skills</h2>
        <dl className="skills">
          {GROUP_ORDER.map((group) => {
            const ids = tech.filter((id) => TECH[id].group === group)
            if (ids.length === 0) return null
            return (
              <div key={group} className="skills-row">
                <dt>{GROUP_LABEL[group]}</dt>
                <dd>{ids.map((id) => TECH[id].label).join(' · ')}</dd>
              </div>
            )
          })}
        </dl>
      </section>

      <section className="section">
        <h2>Experience</h2>
        {roles.map((role) => {
          const bullets = role.bullets.slice(
            0,
            role.printBulletLimit ?? role.bullets.length
          )
          return (
            <article
              key={role.id}
              data-testid={`role-${role.id}`}
              className={`role role--${role.detail}`}
            >
              <div className="role-head">
                <h3>
                  {role.title}
                  {role.company !== undefined && (
                    <span className="company"> · {role.company}</span>
                  )}
                </h3>
                <span className="period">
                  {formatPeriod(role.period, 'en')}
                </span>
              </div>
              {role.location !== undefined && (
                <p className="location">{role.location}</p>
              )}
              {bullets.length > 0 && (
                <ul>
                  {bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </article>
          )
        })}
      </section>

      <section className="section">
        <h2>Projects</h2>
        {data.projects.map((item) => (
          <article
            key={item.id}
            data-testid={`project-${item.id}`}
            className="project"
          >
            <h3>
              {item.name}
              {item.url !== undefined && (
                <span className="url">
                  {' '}
                  — {item.url.replace('https://', '')}
                </span>
              )}
            </h3>
            <p>{item.summary}</p>
            {item.bullets.map((bullet) => (
              <p key={bullet} className="project-detail">
                {bullet}
              </p>
            ))}
          </article>
        ))}
      </section>

      <section className="section two-column">
        <div>
          <h2>Certificates</h2>
          {data.certificates.map((item) => (
            <p key={item.id}>
              <strong>{item.name}</strong> — {item.issuer}, {item.date} ·{' '}
              {item.credentialId}
            </p>
          ))}
        </div>
        <div>
          <h2>Education</h2>
          {data.education.map((item) => (
            <p key={item.id}>
              {item.institution} — {item.degree}, {item.from}–{item.to}
            </p>
          ))}
          <h2>Languages</h2>
          <p>
            {data.languages
              .map((item) => `${item.name} — ${item.level}`)
              .join(' · ')}
          </p>
        </div>
      </section>
    </main>
  )
}
