import { matchesTech, TECH, type ResolvedProject, type TechId } from '@cv/data'
import { Card, SectionTitle } from '@cv/ui'
import { useTranslation } from 'react-i18next'

export type ProjectsProps = {
  projects: readonly ResolvedProject[]
  selected: readonly TechId[]
}

/**
 * Projects follow the same rules as roles: the filter dims whatever does not
 * match but never drops it from the document. That is also what makes the
 * filter's hint true — "the cards below are all dimmed" is counted over roles
 * and projects together. An internal product has no public link, and then its
 * name simply stays text.
 */
export const Projects = ({ projects, selected }: ProjectsProps) => {
  const { t } = useTranslation()

  return (
    <section aria-labelledby="projects-title">
      <SectionTitle id="projects-title">{t('section.projects')}</SectionTitle>
      <div className="grid gap-2 md:grid-cols-2">
        {projects.map((item) => {
          const dimmed = !matchesTech(item, selected)
          return (
            <article
              key={item.id}
              data-testid={`project-${item.id}`}
              data-dimmed={dimmed}
            >
              <Card dimmed={dimmed}>
                <h3 className="font-semibold text-ink">
                  {item.url === undefined ? (
                    item.name
                  ) : (
                    <a
                      href={item.url}
                      rel="noreferrer noopener"
                      target="_blank"
                      className="underline-offset-2 hover:underline"
                    >
                      {item.name}
                    </a>
                  )}
                </h3>
                <p className="mt-1 text-sm text-ink-muted">{item.summary}</p>
                {item.bullets.map((bullet) => (
                  <p key={bullet} className="mt-2 text-sm text-ink">
                    {bullet}
                  </p>
                ))}
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {item.tech.map((id) => (
                    <li
                      key={id}
                      className="rounded-full border border-border px-2 py-0.5 text-xs text-ink-muted"
                    >
                      {TECH[id].label}
                    </li>
                  ))}
                </ul>
              </Card>
            </article>
          )
        })}
      </div>
    </section>
  )
}
