/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * The phone number injected by `define` from `CV_PHONE` at build time.
   * Always a string: an empty one means "the variable is not set" and the contact
   * is not rendered. Neither the sources nor the repository hold the number in
   * any form (design doc §10).
   */
  readonly VITE_CV_PHONE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
