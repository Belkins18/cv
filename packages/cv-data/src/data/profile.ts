import type { Localized } from '../types'

export const profile: { name: string; title: Localized; summary: Localized } = {
  name: 'Nikolay Belibov',
  title: { en: 'Frontend Engineer', uk: 'Фронтенд-інженер' },
  summary: {
    // {{years}} is substituted from the first role: the number never goes stale
    // and never diverges from the timeline.
    en:
      'Frontend engineer with {{years}} years of experience. Most recently — the web client of a ' +
      'network-protocol analysis platform: packet parsing, normalization, schema-driven rendering, ' +
      'and tables and timelines over large volumes of data. I build frontends from scratch on React, ' +
      'TypeScript in strict mode and Vite, and I close tasks beyond the frontend — desktop, traffic ' +
      'capture, parsers, database schemas — through AI-assisted development, writing my own agent ' +
      'skills and workflows.',
    // The form "{{years}} років" is correct for 11-20; at 21 it needs the
    // singular and this line needs an edit — revisit in 2036.
    uk:
      'Фронтенд-інженер, {{years}} років досвіду. Останнє — вебклієнт платформи аналізу мережевих ' +
      'протоколів: розбір пакетів, нормалізація, схемно-кероване відображення, таблиці й таймлайни ' +
      'поверх великих обсягів даних. Будую фронтенди з нуля на React, TypeScript у strict-режимі та ' +
      'Vite, і закриваю задачі за межами фронтенду — десктоп, перехоплення трафіку, парсери, схеми ' +
      'БД — через AI-assisted розробку, під яку пишу власні скіли та воркфлоу.'
  }
}

export const contacts = {
  email: 'belibov.nikolay@gmail.com',
  telegram: '@belkins_22',
  linkedin: 'https://www.linkedin.com/in/nikolay-belibov-781507b3/',
  github: 'https://github.com/Belkins18',
  location: {
    en: 'Mykolaiv, Ukraine · remote since 2022',
    uk: 'Миколаїв, Україна · віддалено з 2022'
  }
  // A phone number never goes here: it arrives from CV_PHONE at the PDF build step.
}
