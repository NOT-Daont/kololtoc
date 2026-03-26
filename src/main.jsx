import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { getMerakiPositions } from './api/dataDragon.js'

// Preload Meraki position data immediately so it's cached before user spins
getMerakiPositions();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
