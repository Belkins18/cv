import type { Locale, ResolvedCv } from '@cv/data'
import { IconButton } from '@cv/ui'
import type { ThemeMode } from '@/state/preferences'

export type RailProps = {
  data: ResolvedCv
  locale: Locale
  themeMode: ThemeMode
  onLocale: (locale: Locale) => void
  onThemeMode: (mode: ThemeMode) => void
}

/** Кнопка перебирает три режима по кругу: system → light → dark → system. */
const NEXT_MODE: Record<ThemeMode, ThemeMode> = {
  system: 'light',
  light: 'dark',
  dark: 'system'
}
const MODE_GLYPH: Record<ThemeMode, string> = {
  system: '◐',
  light: '☀',
  dark: '☾'
}

export const Rail = ({
  data,
  locale,
  themeMode,
  onLocale,
  onThemeMode
}: RailProps) => (
  <aside className="flex w-full shrink-0 flex-col gap-4 border-border p-6 lg:sticky lg:top-0 lg:h-dvh lg:w-72 lg:border-r">
    <div>
      <h1 className="text-2xl font-bold leading-tight text-ink">
        {data.profile.name}
      </h1>
      <p className="text-ink-muted">{data.profile.title}</p>
    </div>
    <ul className="space-y-1 text-sm text-ink-muted">
      <li>
        <a href={`mailto:${data.contacts.email}`}>{data.contacts.email}</a>
      </li>
      <li>
        <a href={`https://t.me/${data.contacts.telegram.replace('@', '')}`}>
          {data.contacts.telegram}
        </a>
      </li>
      <li>
        <a href={data.contacts.linkedin}>LinkedIn</a>
      </li>
      <li>
        <a href={data.contacts.github}>GitHub</a>
      </li>
      <li>{data.contacts.location}</li>
    </ul>
    <div className="flex items-center gap-2">
      <IconButton
        label="Switch language"
        pressed={locale === 'uk'}
        onClick={() => onLocale(locale === 'en' ? 'uk' : 'en')}
      >
        {locale.toUpperCase()}
      </IconButton>
      <IconButton
        label="Switch theme"
        onClick={() => onThemeMode(NEXT_MODE[themeMode])}
      >
        {MODE_GLYPH[themeMode]}
      </IconButton>
    </div>
    {/* Файл кладёт шаг pdf сборки — см. Task 21. */}
    <a
      href="/cv-nikolay-belibov.pdf"
      download
      className="rounded-md border border-accent px-3 py-2 text-center text-accent"
    >
      Download PDF
    </a>
  </aside>
)
