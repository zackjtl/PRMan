import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthCallback } from '@/pages/AuthCallback'
import { PrototypeHome } from '@/pages/PrototypeHome'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PrototypeHome />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
