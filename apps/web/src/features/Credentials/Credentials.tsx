import type { ResolvedCv } from '@cv/data'
import { SectionTitle } from '@cv/ui'
import { useTranslation } from 'react-i18next'

export type CredentialsProps = {
  certificates: ResolvedCv['certificates']
  education: ResolvedCv['education']
  languages: ResolvedCv['languages']
}

/**
 * Three short columns in one section: a certificate with no verifiable link
 * proves nothing, so a certificate's name is always a link to the issuer's
 * record.
 */
export const Credentials = ({
  certificates,
  education,
  languages
}: CredentialsProps) => {
  const { t } = useTranslation()

  return (
    <section
      aria-labelledby="credentials-title"
      className="grid gap-6 md:grid-cols-3"
    >
      <h2 id="credentials-title" className="sr-only">
        {t('section.credentials')}
      </h2>
      <div>
        <SectionTitle id="certificates-title">
          {t('section.certificates')}
        </SectionTitle>
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
        <SectionTitle id="education-title">
          {t('section.education')}
        </SectionTitle>
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
        <SectionTitle id="languages-title">
          {t('section.languages')}
        </SectionTitle>
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
}
