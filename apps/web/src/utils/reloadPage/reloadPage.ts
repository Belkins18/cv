/**
 * Перезагрузка страницы, вынесенная в отдельный модуль не ради красоты,
 * а ради проверяемости: `window.location` в jsdom — unforgeable-свойство,
 * подменить `reload` на объекте нельзя. Подменяется модуль целиком.
 */
export const reloadPage = (): void => {
  window.location.reload()
}
