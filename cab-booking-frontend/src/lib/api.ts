import axios, { type AxiosError, type AxiosInstance } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:9000'
const TOKEN_KEY = 'cab_booking_token'

export type AuthTokenResponse = {
  access_token: string
  token_type: string
}

export type UserRegisterPayload = {
  full_name: string
  email: string
  phone_number?: string | null
  password: string
}

export type UserLoginPayload = {
  email: string
  password: string
}

export type UserProfile = {
  id: number
  full_name: string
  email: string
  phone_number: string | null
  is_active: boolean
  created_at: string
  wallet_balance: number
  total_rides: number
  active_bookings: number
  completed_rides: number
}

export type UserProfileUpdatePayload = {
  full_name?: string | null
  email?: string | null
  phone_number?: string | null
}

export type BookingStatus = 'pending' | 'confirmed' | 'ongoing' | 'completed' | 'cancelled'

export type Booking = {
  id: number
  user_id: number
  pickup_location: string
  dropoff_location: string
  ride_date: string
  booking_time: string
  status: BookingStatus
  fare_amount: number
  notes: string | null
  created_at: string
}

export type BookingCreatePayload = {
  pickup_location: string
  dropoff_location: string
  ride_date: string
  notes?: string | null
}

export type BookingStatusPayload = {
  status: BookingStatus
}

export type Wallet = {
  id: number
  user_id: number
  balance: number
  currency: string
  updated_at: string
  created_at: string
}

export type WalletTransactionPayload = {
  amount: number
  transaction_type: 'deposit' | 'withdraw' | 'payment' | 'refund'
  description?: string | null
  reference_type?: string | null
  reference_id?: number | null
}

export type WalletTransactionRecord = {
  id: number
  wallet_id: number
  user_id: number
  amount: number
  transaction_type: 'deposit' | 'withdraw' | 'payment' | 'refund'
  description: string | null
  reference_type: string | null
  reference_id: number | null
  balance_after: number
  created_at: string
}

export type WalletStatement = {
  wallet: Wallet
  transactions: WalletTransactionRecord[]
  total_credits: number
  total_debits: number
}

export type Dashboard = {
  total_bookings: number
  total_rides: number
  completed_rides: number
  active_bookings: number
  cancelled_rides: number
  total_spent: number
  wallet_balance: number
  currency: string
  recent_bookings: Booking[]
}

export type ApiError = {
  detail?: string
}

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)

  if (token) {
    const headers = config.headers ?? {}

    if (typeof (headers as { set?: (name: string, value: string) => void }).set === 'function') {
      (headers as { set: (name: string, value: string) => void }).set('Authorization', `Bearer ${token}`)
    } else {
      ;(headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
    }

    config.headers = headers
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
    }

    return Promise.reject(error)
  },
)

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export const clearToken = clearAuthToken

export function extractApiErrorMessage(error: unknown) {
  if (axios.isAxiosError<ApiError>(error)) {
    return error.response?.data?.detail ?? error.message ?? 'Request failed.'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Request failed.'
}

export async function loginUser(payload: UserLoginPayload) {
  const response = await api.post<AuthTokenResponse>('/auth/login', payload)
  return response.data
}

export async function registerUser(payload: UserRegisterPayload) {
  const response = await api.post('/auth/register', payload)
  return response.data as UserProfile
}

export async function getProfile() {
  const response = await api.get<UserProfile>('/profile')
  return response.data
}

export async function updateProfile(payload: UserProfileUpdatePayload) {
  const response = await api.put<UserProfile>('/profile', payload)
  return response.data
}

export async function getDashboard() {
  const response = await api.get<Dashboard>('/dashboard')
  return response.data
}

export async function createBooking(payload: BookingCreatePayload) {
  const response = await api.post<Booking>('/bookings', payload)
  return response.data
}

export async function getBookingHistory() {
  const response = await api.get<Booking[]>('/bookings/history')
  return response.data
}

export async function getWallet() {
  const response = await api.get<Wallet>('/wallet')
  return response.data
}

export async function getWalletHistory() {
  const response = await api.get<WalletStatement>('/wallet/history')
  return response.data
}

export async function getWalletStatement() {
  const response = await api.get<WalletStatement>('/wallet/statement')
  return response.data
}

export async function createWalletTransaction(payload: WalletTransactionPayload) {
  const response = await api.post<{ message: string; wallet: Wallet; transaction_type: WalletTransactionPayload['transaction_type']; amount: number }>('/wallet/transaction', payload)
  return response.data
}

export default api