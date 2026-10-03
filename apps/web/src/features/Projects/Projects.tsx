import { matchesTech, TECH, type ResolvedProject, type TechId } from '@cv/data'
import { Card, SectionTitle } from '@cv/ui'

export type ProjectsProps = {
  projects: readonly ResolvedProject[]
  selected: readonly TechId[]
}

/**
 * Проекты живут по тем же правилам, что и роли: фильтр гасит несовпавшие,
 * но не выкидывает их из документа. Это же делает правдой подсказку фильтра —
 * «все карточки ниже погашены» считается по ролям и проектам сразу.
 * У внутреннего продукта публичной ссылки нет — тогда имя остаётся текстом.
 */
export const Projects = ({ projects, selected }: ProjectsProps) => (
  <section aria-labelledby="projects-title">
    <SectionTitle id="projects-title">Projects</SectionTitle>
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
