import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// При globals: false testing-library не находит глобальный afterEach и свою
// автоочистку не регистрирует: отрендеренное остаётся в document.body, и второй
// же render даёт «Found multiple elements». Поэтому cleanup подключается руками.
afterEach(cleanup)
