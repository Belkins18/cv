/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Телефон, подставленный `define`-ом из `CV_PHONE` на шаге сборки.
   * Всегда строка: пустая означает «переменная не задана», и контакт не рендерится.
   * В исходниках и в репозитории номера нет ни в каком виде (дизайн §10).
   */
  readonly VITE_CV_PHONE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
