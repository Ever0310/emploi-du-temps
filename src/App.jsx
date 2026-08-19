import { useState } from 'react'
import LoginPage from './components/LoginPage'
import MainSchedule from './components/MainSchedule'
import { checkPassword } from './utils/auth'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('edt_auth') === '1'
  })

  const handleLogin = (password) => {
    if (checkPassword(password)) {
      sessionStorage.setItem('edt_auth', '1')
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const handleLogout = () => {
    sessionStorage.removeItem('edt_auth')
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) return <LoginPage onLogin={handleLogin} />
  return <MainSchedule onLogout={handleLogout} />
}
