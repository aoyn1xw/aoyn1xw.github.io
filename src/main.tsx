import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
// Adjust path because styles folder lives at project root, not inside src
import '../styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)