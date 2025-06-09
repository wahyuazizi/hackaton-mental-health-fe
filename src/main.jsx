import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import Home from './pages/Home.jsx'
import Assessment from './pages/Assesment.jsx'
import ChatCounselor from './pages/ChatCounselor.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/chat" element={<ChatCounselor />} />
      </Routes>
    </Router>
  </StrictMode>,
)