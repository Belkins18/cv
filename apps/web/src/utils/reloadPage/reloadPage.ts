/**
 * A page reload pulled out into its own module not for elegance but for
 * testability: in jsdom `window.location` is an unforgeable property, so
 * `reload` cannot be stubbed on the object. The whole module is mocked instead.
 */
export const reloadPage = (): void => {
  window.location.reload()
}
