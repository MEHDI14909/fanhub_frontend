import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { FanHubProvider } from './context/FanHubContext.jsx'
import './style.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <FanHubProvider>
        <App />
      </FanHubProvider>
    </BrowserRouter>
  </React.StrictMode>
)
