import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
// Словари подключаются один раз на прогон: без инициализации i18next
// `t` возвращает сам ключ, и каждый тест с видимой строкой красный.
import '@/i18n'

// При globals: false testing-library не находит глобальный afterEach и свою
// автоочистку не регистрирует: отрендеренное остаётся в document.body, и второй
// же render даёт «Found multiple elements». Поэтому cleanup подключается руками.
afterEach(cleanup)
