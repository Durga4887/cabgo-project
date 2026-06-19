import Login from '@/pages/Login'
import Register from '@/pages/Register'
import ForgotPassword from '@/pages/ForgotPassword'
import VerifyOTP from '@/pages/VerifyOTP'
import Dashboard from '@/pages/Dashboard'
import BookingSuccess from '@/pages/BookingSuccess'
import BookingDetails from '@/pages/BookingDetails'
import Profile from '@/pages/Profile'
import Wallet from '@/pages/Wallet'
import RideHistoryPage from '@/pages/rides'

import { Navigate, Route, Routes } from 'react-router-dom'

import { AppShell } from '@/components/layout/app-shell'
import Home from '@/components/Home'
import { BookRidePage } from '@/pages/book-ride'
import { NotFoundPage } from '@/pages/not-found'
import { SupportPage } from '@/pages/support'

export function AppRouter() {
  return (
    <Routes>
      <Route index element={<Home />} />

      <Route element={<AppShell />}>
        <Route path="book" element={<BookRidePage />} />
        <Route path="rides" element={<RideHistoryPage />} />
        <Route path="support" element={<SupportPage />} />
        <Route path="profile" element={<Profile />} />
        <Route path="wallet" element={<Wallet />} />
      </Route>

      <Route path="dashboard" element={<Dashboard />} />

      <Route
        path="booking-details"
        element={<BookingDetails />}
      />

      <Route
        path="booking-success"
        element={<BookingSuccess />}
      />

      <Route
        path="auth"
        element={<Navigate to="/login" replace />}
      />

      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="verify-otp" element={<VerifyOTP />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}