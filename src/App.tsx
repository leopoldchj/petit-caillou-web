import { Navigate, Route, Routes } from 'react-router-dom'

import { RequireAuth } from './auth/RequireAuth'
import { AuthPage } from './pages/AuthPage'
import { HomePage } from './pages/HomePage'

export function App()
{
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route
        path="/"
        element={(
          <RequireAuth>
            <HomePage />
          </RequireAuth>
        )}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
