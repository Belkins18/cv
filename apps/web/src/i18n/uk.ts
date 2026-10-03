import type { UiKey } from './en'

/**
 * `Record<UiKey, string>` держит полноту на типах: ключ, появившийся в `en`,
 * не даст собрать проект, пока у него нет украинского значения.
 */
export const uk: Record<UiKey, string> = {
  'section.summary': 'Коротко про себе',
  'section.experience': 'Досвід',
  'section.projects': 'Проєкти',
  'section.filter': 'Фільтр за стеком',
  'section.credentials': 'Сертифікати, освіта та мови',
  'section.certificates': 'Сертифікати',
  'section.education': 'Освіта',
  'section.languages': 'Мови',
  'filter.empty':
    'За цим стеком нічого не знайшлося — усі картки нижче пригашені.',
  'filter.reset': 'Скинути фільтр',
  'state.loading': 'Завантаження резюме',
  'state.error': 'Не вдалося завантажити дані резюме.',
  'state.retry': 'Спробувати ще раз',
  'action.downloadPdf': 'Завантажити PDF',
  'action.switchLanguage': 'Змінити мову',
  'action.switchTheme': 'Змінити тему',
  'shortcuts.title': 'Гарячі клавіші',
  'shortcuts.focusFilter': 'Перейти до фільтра стеку',
  'shortcuts.toggleHelp': 'Показати або сховати цю довідку',
  'shortcuts.close': 'Закрити',
  'metric.years': 'років у фронтенді',
  'metric.roles': 'ролей',
  'metric.tech': 'технологій у продакшені',
  'metric.tokens': 'дешевша міграція події'
}
