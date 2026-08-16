import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router'

import App from './app/App'
import { ThemeProvider } from './app/theme/ThemeProvider'
import './styles/index.css'

const rootEl = document.getElementById('root')
if (!rootEl) {
  throw new Error('Missing #root element')
}

ReactDOM.createRoot(rootEl).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)

