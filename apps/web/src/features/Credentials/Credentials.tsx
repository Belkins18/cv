import type { ResolvedCv } from '@cv/data'
import { SectionTitle } from '@cv/ui'

export type CredentialsProps = {
  certificates: ResolvedCv['certificates']
  education: ResolvedCv['education']
  languages: ResolvedCv['languages']
}

/**
 * Три короткие колонки одной секции: сертификат без проверяемой ссылки
 * ничего не доказывает, поэтому имя сертификата — всегда ссылка на выдачу.
 */
export const Credentials = ({
  certificates,
  education,
  languages
}: CredentialsProps) => (
  <section
    aria-labelledby="credentials-title"
    className="grid gap-6 md:grid-cols-3"
  >
    <h2 id="credentials-title" className="sr-only">
      Certificates, education and languages
    </h2>
    <div>
      <SectionTitle id="certificates-title">Certificates</SectionTitle>
      {certificates.map((item) => (
        <p
          key={item.id}
          data-testid={`certificate-${item.id}`}
          className="mb-2 text-sm"
        >
          <a
            href={item.url}
            rel="noreferrer noopener"
            target="_blank"
            className="text-ink underline-offset-2 hover:underline"
          >
            {item.name}
          </a>
          <span className="block text-ink-muted">
            {item.issuer} · {item.credentialId}
          </span>
        </p>
      ))}
    </div>
    <div>
      <SectionTitle id="education-title">Education</SectionTitle>
      {education.map((item) => (
        <p
          key={item.id}
          data-testid={`education-${item.id}`}
          className="mb-2 text-sm text-ink-muted"
        >
          <span className="text-ink">{item.institution}</span>
          <span className="block">
            {item.degree}, {item.from}–{item.to}
          </span>
        </p>
      ))}
    </div>
    <div>
      <SectionTitle id="languages-title">Languages</SectionTitle>
      {languages.map((item) => (
        <p
          key={item.id}
          data-testid={`language-${item.id}`}
          className="mb-2 text-sm text-ink-muted"
        >
          <span className="text-ink">{item.name}</span> — {item.level}
        </p>
      ))}
    </div>
  </section>
)
