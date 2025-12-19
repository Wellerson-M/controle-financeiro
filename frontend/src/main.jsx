import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Register Service Worker only in production to avoid dev-cache issues
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.warn('ServiceWorker registration failed:', err)
    })
  })
}
// In development, ensure any previously registered SW is unregistered
if (!import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(reg => reg.unregister())
  })
}
