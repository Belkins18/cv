import { cv, project } from '@cv/data'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/App'
import './print.css'

const root = document.getElementById('root')
if (root === null) throw new Error('не найден #root')

// Телефон приходит из окружения сборки и живёт только в PDF (дизайн §10).
const phone = import.meta.env['VITE_CV_PHONE'] as string | undefined

createRoot(root).render(
  <StrictMode>
    <App data={project(cv, 'en')} phone={phone} now={new Date()} />
  </StrictMode>
)
