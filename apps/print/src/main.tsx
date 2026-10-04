import { cv, project } from '@cv/data'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/App'
import './print.css'

const root = document.getElementById('root')
if (root === null) throw new Error('#root was not found')

// The phone number reaches the bundle from CV_PHONE through define in
// vite.config.ts (design doc §10). An empty string is the ordinary "variable not
// set" case: the phone block is simply not rendered.
const phone = import.meta.env.VITE_CV_PHONE

createRoot(root).render(
  <StrictMode>
    <App data={project(cv, 'en')} phone={phone} now={new Date()} />
  </StrictMode>
)
