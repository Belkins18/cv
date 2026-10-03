import { loadCv, type Locale, type ResolvedCv } from '@cv/data'
import { queryOptions } from '@tanstack/react-query'

export const cvQueryOptions = (locale: Locale) =>
  queryOptions<ResolvedCv>({
    queryKey: ['cv', locale],
    queryFn: () => loadCv(locale),
    staleTime: Number.POSITIVE_INFINITY, // данные неизменны внутри сборки
    /*
     * Повторять нечего. `loadCv` грузит локаль динамическим `import()`, а
     * провалившийся импорт браузер запоминает: module map хранит null, и каждая
     * следующая попытка падает мгновенно, не отправив ни одного запроса.
     * Дефолтные три повтора с нарастающей паузой дают семь секунд скелетона
     * ради четырёх отказов подряд — человек всё это время смотрит на ложь.
     * Настоящий повтор — перезагрузка страницы, её делает кнопка в CvError.
     */
    retry: false
  })
