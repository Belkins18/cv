import type { Cv } from '../schema'

type Role = Cv['roles'][number]

export const roles: Role[] = [
  {
    id: 'wirex',
    company: 'WireX Systems',
    companyUrl: 'https://wirexsystems.com/ne2ition-ndr-platform',
    location: { en: 'Israel / USA · remote', uk: 'Ізраїль / США · віддалено' },
    title: { en: 'Frontend Developer', uk: 'Frontend Developer' },
    period: { start: '2024-06', end: null },
    detail: 'full',
    printBulletLimit: 5,
    tech: [
      'react',
      'typescript',
      'vite',
      'virtualization',
      'node',
      'express',
      'sse',
      'amcharts',
      'claude-code',
      'tailwind'
    ],
    bullets: [
      {
        en: "Built the web client that replaces a legacy Qt desktop application for Ne2ition, the company's network-protocol analysis platform — the old client only ran on outdated Linux systems.",
        uk: 'Побудував вебклієнт на заміну легасі Qt-застосунку для Ne2ition, платформи аналізу мережевих протоколів компанії, — старий клієнт працював лише на застарілих Linux-системах.'
      },
      {
        en: 'Designed a manifest-driven event architecture: a manifest declares what each protocol event shows, builders produce one normalized view model, and the table, the expanded view, search and sorting all read from it instead of a hand-written renderer per event type — 70+ event types across 15 protocol categories.',
        uk: 'Спроєктував manifest-driven архітектуру подій: маніфест описує, що показує кожна подія, білдери готують єдину нормалізовану модель, а таблиця, розгорнутий блок, пошук і сортування читають її замість окремого рендерера на кожен тип події — 70+ типів подій у 15 категоріях протоколів.'
      },
      {
        en: 'Replaced a deep UI-library component chain inside the recursive renderer with native nodes and virtualized the heavy expanded lists, which removed the interaction-latency regression on events with hundreds of fields.',
        uk: 'Замінив глибокий ланцюжок компонентів UI-бібліотеки всередині рекурсивного рендера на нативні вузли та віртуалізував важкі розгорнуті списки — це прибрало просідання швидкодії на подіях із сотнями полів.'
      },
      {
        en: 'Re-architected our event-migration process from one monolithic command into a five-phase suite with on-disk artifacts, strict context guards and generation delegated to a sub-agent: roughly 8× lower token cost per migrated event, peak context down by two thirds, and runs that no longer hit the five-hour wall.',
        uk: "Переробив процес міграції подій із монолітної команди на п'ятифазний suite з артефактами на диску, жорсткими context-гардами та делегуванням генерації субагенту: приблизно у 8 разів дешевше за токенами на подію, піковий контекст менший на дві третини, прогони перестали впиратись у п'ятигодинний ліміт."
      },
      {
        en: 'Built PDF Creator, a separate internal reporting product: Vite + React + TypeScript with amCharts 5 charts and geo maps, plus my own Express/TypeScript SSE server — a pool of render clients registering over SSE with available/busy state, a job queue and file upload, so reports are generated across the pool instead of in one browser tab.',
        uk: 'Побудував PDF Creator, окремий внутрішній продукт звітності: Vite + React + TypeScript з графіками й картами на amCharts 5 і власним Express/TypeScript SSE-сервером — пул клієнтів із реєстрацією через SSE, статусами available/busy, чергою задач і завантаженням файлів, тож звіти генеруються пулом, а не вкладкою браузера.'
      },
      {
        en: 'Built search over a prepared index of the normalized view rather than the raw payload, with match highlighting and navigation between results.',
        uk: 'Зробив пошук поверх підготовленого індексу нормалізованого подання, а не сирих даних, з підсвічуванням збігів і навігацією між результатами.'
      },
      {
        en: 'Consolidated backend event schemas from three diverging sources into a single merged set with my own tooling, turning each schema update from a review of thousands of lines into a readable delta.',
        uk: 'Звів бекендові схеми подій із трьох розбіжних джерел в один merged-набір власним тулінгом: кожне оновлення схеми перетворилося з перегляду тисяч рядків на читабельну дельту.'
      }
    ]
  },
  {
    id: 'cbs-tech',
    company: 'CBS Tech',
    location: { en: 'Israel · remote', uk: 'Ізраїль · віддалено' },
    title: { en: 'Frontend Developer', uk: 'Frontend Developer' },
    period: { start: '2023-10', end: '2024-04' },
    detail: 'full',
    tech: ['react', 'typescript'],
    bullets: [] // заполняется по ответу на вопрос 1 из Task 5, Step 1
  },
  {
    id: 'bidflyer',
    company: 'Bidflyer',
    location: { en: 'Israel · remote', uk: 'Ізраїль · віддалено' },
    title: { en: 'Frontend Developer', uk: 'Frontend Developer' },
    period: { start: '2022-12', end: '2023-09' },
    detail: 'full',
    tech: ['react', 'typescript'],
    bullets: [] // вопрос 2
  },
  {
    id: 'poollotto',
    company: 'Poollotto Finance',
    location: { en: 'Israel · remote', uk: 'Ізраїль · віддалено' },
    title: {
      en: 'Frontend Blockchain Developer',
      uk: 'Frontend Blockchain Developer'
    },
    period: { start: '2021-12', end: '2022-08' },
    detail: 'full',
    tech: ['react', 'typescript', 'wagmi', 'reown', 'ethers', 'evm'],
    bullets: [] // вопрос 3
  },
  {
    id: 'extrawest',
    company: 'Extrawest',
    location: { en: 'Mykolaiv, Ukraine', uk: 'Миколаїв, Україна' },
    title: { en: 'Frontend Developer', uk: 'Frontend Developer' },
    period: { start: '2021-09', end: '2022-03' },
    detail: 'full',
    tech: ['react', 'typescript'],
    bullets: [] // вопрос 4
  },
  {
    id: 'ownix',
    company: 'ownix',
    location: { en: 'Israel · remote', uk: 'Ізраїль · віддалено' },
    title: {
      en: 'Frontend Developer · NFT marketplace',
      uk: 'Frontend Developer · NFT-маркетплейс'
    },
    period: { start: '2021-09', end: '2021-12' },
    detail: 'full',
    tech: ['react', 'typescript', 'ethers', 'evm'],
    bullets: [] // вопрос 5
  },
  {
    id: 'dstar-lab',
    company: 'dSTAR LAB Ltd',
    location: { en: 'Remote', uk: 'Віддалено' },
    title: {
      en: 'Frontend Developer · cross-platform desktop',
      uk: 'Frontend Developer · кросплатформний десктоп'
    },
    period: { start: '2019-01', end: '2021-08' },
    detail: 'full',
    tech: ['react', 'javascript', 'electron', 'webrtc', 'scss'],
    bullets: [] // вопрос 6
  },
  {
    id: 'early-web',
    // Компания не указывается осознанно: период девятилетней давности, джуновский.
    location: { en: 'Remote', uk: 'Віддалено' },
    title: { en: 'Frontend / HTML developer', uk: 'Frontend / HTML developer' },
    period: { start: '2015-01', end: '2018-12' },
    detail: 'compact',
    tech: ['javascript', 'scss', 'webpack'],
    bullets: []
  }
]
