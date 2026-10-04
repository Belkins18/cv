/**
 * Interface chrome only. The content of the resume lives in the dataset and is
 * already bilingual: nothing here says anything about Nikolay — these strings
 * label buttons.
 */
export const en = {
  'section.summary': 'Summary',
  'section.experience': 'Experience',
  'section.projects': 'Projects',
  'section.filter': 'Filter by stack',
  'section.credentials': 'Certificates, education and languages',
  'section.certificates': 'Certificates',
  'section.education': 'Education',
  'section.languages': 'Languages',
  'filter.empty':
    'Nothing matches this stack — the cards below are all dimmed.',
  'filter.reset': 'Reset the filter',
  'state.loading': 'Loading CV',
  'state.error': 'Could not load the CV data.',
  'state.retry': 'Retry',
  'action.downloadPdf': 'Download PDF',
  'action.switchLanguage': 'Switch language',
  'action.switchTheme': 'Switch theme',
  'shortcuts.title': 'Keyboard shortcuts',
  'shortcuts.focusFilter': 'Focus the stack filter',
  'shortcuts.toggleHelp': 'Show or hide this help',
  'shortcuts.close': 'Close',
  'metric.years': 'years in frontend',
  'metric.roles': 'roles',
  'metric.tech': 'technologies in production',
  'metric.tokens': 'cheaper event migration'
} as const

export type UiKey = keyof typeof en
