import { Navigate, Route } from 'react-router-dom'

import ForgotPassword from '@/pages/ForgotPassword'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import VerifyOTP from '@/pages/VerifyOTP'

function AuthenticationRoutes() {
  return (
    <>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="verify-otp" element={<VerifyOTP />} />
      <Route path="login/" element={<Navigate to="/login" replace />} />
    </>
  )
}

export default AuthenticationRoutes