export type TechGroup =
  | 'core'
  | 'state'
  | 'ui'
  | 'tooling'
  | 'testing'
  | 'backend'
  | 'web3'
  | 'legacy'

export type TechMeta = { readonly label: string; readonly group: TechGroup }

/** A registry, not free strings: a typo in an id is a compile error, and the filter is derived from the data. */
export const TECH = {
  react: { label: 'React', group: 'core' },
  typescript: { label: 'TypeScript', group: 'core' },
  javascript: { label: 'JavaScript', group: 'core' },
  zod: { label: 'zod', group: 'core' },
  vite: { label: 'Vite', group: 'tooling' },
  webpack: { label: 'Webpack', group: 'tooling' },
  pnpm: { label: 'pnpm workspaces', group: 'tooling' },
  turborepo: { label: 'Turborepo', group: 'tooling' },
  bun: { label: 'Bun', group: 'tooling' },
  'claude-code': { label: 'Claude Code', group: 'tooling' },
  'tanstack-query': { label: 'TanStack Query', group: 'state' },
  'tanstack-router': { label: 'TanStack Router', group: 'state' },
  redux: { label: 'Redux', group: 'state' },
  zustand: { label: 'Zustand', group: 'state' },
  'react-hook-form': { label: 'React Hook Form', group: 'ui' },
  tailwind: { label: 'Tailwind CSS', group: 'ui' },
  shadcn: { label: 'shadcn/ui', group: 'ui' },
  radix: { label: 'Radix UI', group: 'ui' },
  emotion: { label: 'Emotion', group: 'ui' },
  'styled-components': { label: 'styled-components', group: 'ui' },
  scss: { label: 'SCSS', group: 'ui' },
  amcharts: { label: 'amCharts 5', group: 'ui' },
  canvas: { label: 'Canvas', group: 'ui' },
  dnd: { label: 'Drag and drop', group: 'ui' },
  i18next: { label: 'i18next', group: 'ui' },
  virtualization: { label: 'List virtualization', group: 'ui' },
  vitest: { label: 'Vitest', group: 'testing' },
  playwright: { label: 'Playwright', group: 'testing' },
  node: { label: 'Node.js', group: 'backend' },
  express: { label: 'Express', group: 'backend' },
  sse: { label: 'Server-Sent Events', group: 'backend' },
  supabase: { label: 'Supabase', group: 'backend' },
  electron: { label: 'Electron', group: 'backend' },
  webrtc: { label: 'WebRTC', group: 'backend' },
  wagmi: { label: 'wagmi', group: 'web3' },
  reown: { label: 'Reown (WalletConnect)', group: 'web3' },
  ethers: { label: 'ethers.js', group: 'web3' },
  evm: { label: 'EVM chains', group: 'web3' },
  solana: { label: 'Solana', group: 'web3' },
  tron: { label: 'Tron', group: 'web3' },
  ledger: { label: 'Ledger', group: 'web3' },
  vue: { label: 'Vue', group: 'legacy' },
  nuxt: { label: 'Nuxt', group: 'legacy' },
  pinia: { label: 'Pinia / Vuex', group: 'legacy' }
} as const satisfies Record<string, TechMeta>

export type TechId = keyof typeof TECH

export const TECH_IDS = Object.keys(TECH) as TechId[]

export const isTechId = (value: string): value is TechId =>
  Object.hasOwn(TECH, value)
