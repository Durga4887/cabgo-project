import { useEffect, useState } from 'react'

import { api } from '@/lib/api'

type ProfileData = {
  id: number
  full_name: string
  email: string
  phone_number: string | null
  is_active: boolean
  created_at: string
  wallet_balance: number
  total_rides: number
}

function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get<ProfileData>('/profile').then((response) => {
      setProfile(response.data)
      setFullName(response.data.full_name)
      setEmail(response.data.email)
      setPhoneNumber(response.data.phone_number ?? '')
    })
  }, [])

  const handleEditProfile = async () => {
    setSaving(true)

    try {
      const { data } = await api.put('/profile', {
        full_name: fullName,
        email,
        phone_number: phoneNumber || null,
      })

      setProfile((current) => (current ? { ...current, ...data } : current))
      alert('Profile updated successfully!')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-3xl border border-yellow-400/20 bg-[#121212] p-8">
        <div className="text-center">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-yellow-400 text-5xl">👤</div>

          <h1 className="mt-4 text-4xl font-bold text-yellow-400">
            {profile?.full_name ?? 'Loading...'}
          </h1>

          <p className="mt-2 text-gray-400">
            {profile?.email ?? 'Premium CabGo User'}
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-black p-5">
            <p className="text-gray-400">Email</p>
            <p className="mt-1 text-lg text-white">{profile?.email ?? '-'}</p>
          </div>

          <div className="rounded-2xl bg-black p-5">
            <p className="text-gray-400">Phone</p>
            <p className="mt-1 text-lg text-white">{profile?.phone_number ?? '-'}</p>
          </div>

          <div className="rounded-2xl bg-black p-5">
            <p className="text-gray-400">City</p>
            <p className="mt-1 text-lg text-white">Visakhapatnam</p>
          </div>

          <div className="rounded-2xl bg-black p-5">
            <p className="text-gray-400">Member Since</p>
            <p className="mt-1 text-lg text-white">
              {profile ? new Date(profile.created_at).toLocaleDateString() : '-'}
            </p>
          </div>

          <div className="rounded-2xl bg-black p-5">
            <p className="text-gray-400">Total Rides</p>
            <p className="mt-1 text-3xl font-bold text-yellow-400">{profile?.total_rides ?? 0}</p>
          </div>

          <div className="rounded-2xl bg-black p-5">
            <p className="text-gray-400">Wallet Balance</p>
            <p className="mt-1 text-3xl font-bold text-green-400">₹{profile?.wallet_balance ?? 0}</p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-black p-5">
          <h2 className="mb-4 text-xl font-bold text-yellow-400">Update Profile</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="rounded-2xl border border-zinc-700 bg-black p-3 text-white"
              placeholder="Full name"
            />
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-2xl border border-zinc-700 bg-black p-3 text-white"
              placeholder="Email"
            />
            <input
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              className="rounded-2xl border border-zinc-700 bg-black p-3 text-white md:col-span-2"
              placeholder="Phone number"
            />
          </div>
        </div>

        <button
          onClick={handleEditProfile}
          disabled={saving}
          className="mt-8 w-full rounded-2xl bg-yellow-400 py-3 font-bold text-black transition hover:bg-yellow-300 disabled:opacity-70"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  )
}

export default Profile