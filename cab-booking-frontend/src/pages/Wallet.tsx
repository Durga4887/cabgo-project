import { useEffect, useState } from 'react'

import { api } from '@/lib/api'

type WalletHistoryResponse = {
  wallet: {
    id: number
    user_id: number
    balance: number
    currency: string
    updated_at: string
    created_at: string
  }
  transactions: Array<{
    id: number
    wallet_id: number
    user_id: number
    amount: number
    transaction_type: string
    description: string | null
    reference_type: string | null
    reference_id: number | null
    balance_after: number
    created_at: string
  }>
}

function Wallet() {
  const [history, setHistory] = useState<WalletHistoryResponse | null>(null)
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')

  const loadWallet = async () => {
    const response = await api.get<WalletHistoryResponse>('/wallet/history')
    setHistory(response.data)
  }

  useEffect(() => {
    loadWallet()
  }, [])

  const handleAddMoney = async () => {
    try {
      await api.post('/wallet/transaction', {
        amount: Number(amount),
        transaction_type: 'deposit',
        description: 'Wallet Topup',
      })

      setMessage('Money added successfully!')
      setAmount('')
      loadWallet()
    } catch (error) {
      setMessage('Failed to add money')
      console.error(error)
    }
  }

  const balance = history?.wallet.balance ?? 0
  const transactions = history?.transactions ?? []

  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <h1 className="mb-8 text-4xl font-bold text-yellow-400">
        Wallet 💰
      </h1>

      <div className="rounded-3xl bg-zinc-900 p-8">
        <h2 className="text-xl text-gray-400">
          Current Balance
        </h2>

        <p className="mt-3 text-5xl font-bold text-green-400">
          ₹{balance}
        </p>
      </div>

      <div className="mt-8 rounded-3xl bg-zinc-900 p-8">
        <h2 className="mb-4 text-2xl font-bold">
          Add Money
        </h2>

        <div className="flex gap-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="flex-1 rounded-xl bg-zinc-800 p-3 text-white outline-none"
          />

          <button
            onClick={handleAddMoney}
            className="rounded-xl bg-yellow-400 px-6 py-3 font-bold text-black"
          >
            Add Money
          </button>
        </div>

        {message && (
          <p className="mt-4 text-green-400">
            {message}
          </p>
        )}
      </div>

      <div className="mt-10 rounded-3xl bg-zinc-900 p-8">
        <h2 className="mb-6 text-2xl font-bold">
          Transaction History
        </h2>

        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-700 text-left text-yellow-400">
              <th className="pb-4">Type</th>
              <th className="pb-4">Amount</th>
              <th className="pb-4">Date</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((item) => (
              <tr
                key={item.id}
                className="border-b border-zinc-800"
              >
                <td
                  className={`py-4 ${
                    item.transaction_type === 'deposit' ||
                    item.transaction_type === 'refund'
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}
                >
                  {item.transaction_type}
                </td>

                <td>₹{item.amount}</td>

                <td>
                  {new Date(
                    item.created_at
                  ).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Wallet