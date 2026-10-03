import { cv, project } from '@cv/data'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/App'
import './print.css'

const root = document.getElementById('root')
if (root === null) throw new Error('не найден #root')

// Телефон проводится в бандл из CV_PHONE через define в vite.config.ts (дизайн §10).
// Пустая строка — штатное «переменная не задана»: блок телефона не рендерится.
const phone = import.meta.env.VITE_CV_PHONE

createRoot(root).render(
  <StrictMode>
    <App data={project(cv, 'en')} phone={phone} now={new Date()} />
  </StrictMode>
)
