// Then update src/App.tsx to include the new route:
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './pages/_app'
import Dashboard from './pages/Dashboard'

function AppRoot() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default AppRoot