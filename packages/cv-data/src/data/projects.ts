import type { Cv } from '../schema'

type Project = Cv['projects'][number]

export const projects: Project[] = [
  {
    id: 'vibr',
    name: 'vibr-clan-statistics',
    url: 'https://vibr-clan-statistics.netlify.app/hydra',
    summary: {
      en: 'Data-heavy dashboard for game clan statistics.',
      uk: 'Насичений даними дашборд статистики ігрового клану.'
    },
    tech: ['react', 'typescript', 'vite', 'tailwind', 'canvas'],
    bullets: [
      {
        en: 'Sortable table with expandable rows and pagination, period selectors, stacked bar charts over 25+ entities, a combined bar + line chart with a brush slider, a live mode, markdown export and a dark theme.',
        uk: 'Сортована таблиця з розгортанням рядків і пагінацією, селектори періоду, стекові бар-чарти на 25+ сутностей, комбінований bar + line з brush-слайдером, live-режим, експорт у markdown і темна тема.'
      }
    ]
  },
  {
    id: 'easyfop',
    name: 'EasyFop',
    url: 'https://easy-fop.netlify.app/',
    summary: {
      en: 'Income and tax tracker for Ukrainian sole proprietors, built frontend-first from scratch.',
      uk: 'Облік доходів і податків ФОП третьої групи, фронтенд побудований з нуля.'
    },
    tech: [
      'react',
      'typescript',
      'vite',
      'bun',
      'supabase',
      'tailwind',
      'shadcn',
      'radix',
      'react-hook-form',
      'zod',
      'tanstack-query',
      'i18next',
      'vitest',
      'playwright'
    ],
    bullets: [
      {
        en: 'Authentication, a quarterly dashboard, income-limit progress, tax obligations, analytics and payment details with period substitution; dark / light / system themes and RU + UK localization.',
        uk: "Авторизація, кабінет із кварталами, прогрес ліміту доходу, зобов'язання, аналітика та реквізити з підстановкою періоду; темна / світла / системна теми й локалізація RU + UK."
      }
    ]
  },
  {
    id: 'pdf-creator',
    name: 'PDF Creator',
    summary: {
      en: 'Internal reporting product at WireX Systems: charts, geo maps and distributed report generation.',
      uk: 'Внутрішній продукт звітності у WireX Systems: графіки, геокарти й розподілена генерація звітів.'
    },
    tech: ['react', 'typescript', 'vite', 'amcharts', 'node', 'express', 'sse'],
    bullets: [
      {
        en: 'Own Express/TypeScript SSE server: a pool of render clients registering over SSE with available/busy state, a job queue and file upload.',
        uk: 'Власний Express/TypeScript SSE-сервер: пул клієнтів із реєстрацією через SSE, статусами available/busy, чергою задач і завантаженням файлів.'
      }
    ]
  },
  {
    id: 'cv',
    name: 'This CV',
    url: 'https://github.com/Belkins18/cv',
    summary: {
      en: 'The monorepo this resume is built from: one dataset, a website and an ATS-readable PDF.',
      uk: 'Монорепозиторій, з якого зібране це резюме: один датасет, сайт і PDF, який читає ATS.'
    },
    tech: [
      'pnpm',
      'turborepo',
      'react',
      'typescript',
      'vite',
      'tanstack-router',
      'tanstack-query',
      'zod',
      'tailwind',
      'radix',
      'shadcn',
      'i18next',
      'vitest',
      'playwright'
    ],
    bullets: [
      {
        en: 'pnpm workspaces + Turborepo, a shared UI package, a zod-validated dataset where every string must exist in both languages, a stack filter that lives in the URL, and a PDF generated from the same layout by Playwright.',
        uk: "pnpm workspaces + Turborepo, спільний UI-пакет, валідований zod датасет, де кожен рядок зобов'язаний існувати двома мовами, фільтр по стеку в URL і PDF, згенерований із тієї ж верстки через Playwright."
      }
    ]
  }
]
