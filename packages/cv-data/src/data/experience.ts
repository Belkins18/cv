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
        // Прод-статус не утверждается: Nikolay прямо сказал, что не знает, доходит ли
        // продукт до клиентов. В тексте только проверяемое — команда, пайплайн, деплой.
        en: "Built the web client that replaces a legacy Qt desktop application for Ne2ition, the company's network-protocol analysis platform — the old client only ran on outdated Linux systems. A frontend team of two, with the release pipeline in place and regular deploys to AWS environments.",
        uk: 'Побудував вебклієнт на заміну легасі Qt-застосунку для Ne2ition, платформи аналізу мережевих протоколів компанії, — старий клієнт працював лише на застарілих Linux-системах. Фронтенд-команда з двох людей, релізний пайплайн готовий, регулярні деплої в середовища на AWS.'
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
    tech: ['react', 'typescript', 'zod'],
    bullets: [
      {
        // Масштаба Nikolay не назвал, поэтому буллет скромный: что делал — и всё.
        // Context API в реестр TECH не идёт: это часть React, а не технология в ряду с Redux.
        en: "Built promotional sites and landing pages on React and TypeScript, with form validation on zod schemas; state stayed in React's own context — the projects needed no external state manager.",
        uk: 'Робив промосайти та лендінги на React і TypeScript, валідація форм — на zod-схемах; стан жив у власному контексті React, зовнішнього стейт-менеджера проєкти не потребували.'
      }
    ]
  },
  {
    id: 'bidflyer',
    company: 'Bidflyer',
    location: { en: 'Israel · remote', uk: 'Ізраїль · віддалено' },
    title: { en: 'Frontend Developer', uk: 'Frontend Developer' },
    period: { start: '2022-12', end: '2023-09' },
    detail: 'full',
    tech: ['react', 'typescript'],
    // Фактов нет и не будет: Nikolay не помнит деталей и прямо попросил
    // не углубляться. Роль идёт строкой с датами и должностью — пустая запись
    // честнее выдуманной.
    bullets: []
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
    // Подтверждено: только EVM-сети. Solana, Tron и Ledger сюда не дописываются.
    bullets: []
  },
  {
    id: 'extrawest',
    company: 'Extrawest',
    location: { en: 'Mykolaiv, Ukraine', uk: 'Миколаїв, Україна' },
    title: { en: 'Frontend Developer', uk: 'Frontend Developer' },
    period: { start: '2021-09', end: '2022-03' },
    detail: 'full',
    tech: ['react', 'typescript'],
    // «Оставь пока без записи»: роль остаётся строкой, описание не пишем.
    bullets: []
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
    tech: ['react', 'typescript', 'ethers', 'evm', 'dnd'],
    bullets: [
      {
        en: 'Implemented drag-and-drop in the NFT marketplace interface — React and TypeScript on the front, ethers.js against EVM networks underneath.',
        uk: 'Реалізував drag-and-drop в інтерфейсі NFT-маркетплейсу — React і TypeScript на фронті, ethers.js до EVM-мереж під ним.'
      }
    ]
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
    tech: ['react', 'javascript', 'electron', 'webrtc', 'scss', 'vue'],
    bullets: [
      {
        // Самый сильный факт в ролях до WireX: перевод легаси-продукта на другой
        // фреймворк на кросс-платформенном десктопе. Пишется развёрнуто.
        en: 'Rewrote the UI stack of a cross-platform Electron desktop product from Vue to React. The application had been built on Vue from the start, and the migration went through its whole component and state layer — a replacement of the old code, not a wrapper around it.',
        uk: 'Переписав UI-стек кросплатформного Electron-десктопу з Vue на React. Застосунок від початку був побудований на Vue, і міграція пройшла через увесь шар компонентів і стану — це заміна старого коду, а не обгортка над ним.'
      },
      {
        en: 'Built the real-time side of the same desktop client: WebRTC communication inside Electron, with the interface styled in SCSS.',
        uk: 'Зробив real-time частину того самого десктопного клієнта: комунікація на WebRTC всередині Electron, інтерфейс — на SCSS.'
      }
    ]
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
