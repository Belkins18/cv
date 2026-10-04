import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
// The dictionaries are wired up once per run: without initializing i18next, `t`
// returns the key itself and every test that looks at a visible string is red.
import '@/i18n'

// With globals: false testing-library cannot find a global afterEach and so
// never registers its auto cleanup: whatever was rendered stays in document.body
// and the very next render reports "Found multiple elements". Hence the manual
// cleanup here.
afterEach(cleanup)
