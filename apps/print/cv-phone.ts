import { fileURLToPath } from 'node:url'
import { loadEnv } from 'vite'

const repoRoot = fileURLToPath(new URL('../../', import.meta.url))

/**
 * Единственное место в репозитории, которое решает, задан телефон или нет.
 *
 * Имя наружу ровно одно — `CV_PHONE`: так оно записано в конституции, в CLAUDE.md,
 * в AGENTS.md и в тесте собранного PDF. Пока источников было два — переменная
 * окружения для теста и переменная с префиксом `VITE_` для сборки, — команда из
 * документации собирала PDF без телефона, и 15 из 16 проверок оставались зелёными.
 * Поэтому и вёрстка, и проверка читают это значение здесь, а не каждая своё.
 *
 * Пустая строка означает «не задан»: блок телефона не рендерится, тест ждёт его
 * отсутствия. Самого номера в репозитории нет ни в каком виде (дизайн §10).
 */
export const resolveCvPhone = (mode = 'production'): string => {
  const fromShell = process.env['CV_PHONE']
  if (fromShell !== undefined && fromShell !== '') return fromShell
  // .env лежит в корне репозитория, а не в папке приложения: команды из
  // документации запускаются из корня. Сам файл в .gitignore, отслеживается
  // только .env.example.
  return loadEnv(mode, repoRoot, 'CV_')['CV_PHONE'] ?? ''
}
