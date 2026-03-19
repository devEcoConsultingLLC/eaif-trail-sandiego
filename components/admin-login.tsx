"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

interface AdminLoginProps {
  onClose: () => void
  onSuccess: () => void
}

export function AdminLogin({ onClose, onSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(authError.message)
      } else {
        onSuccess()
      }
    } catch {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="bg-[#0a0a0a] border border-[#00e7ad]/30 rounded-xl p-6 w-full max-w-sm mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-[#00e7ad] mb-4">Admin Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-[#787878] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-black/50 border border-[#787878]/30 rounded-lg text-white text-sm focus:outline-none focus:border-[#00e7ad]/50"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-[#787878] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-black/50 border border-[#787878]/30 rounded-lg text-white text-sm focus:outline-none focus:border-[#00e7ad]/50"
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm text-[#787878] hover:text-white border border-[#787878]/30 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm bg-[#00e7ad] text-[#004e53] font-bold rounded-lg hover:bg-[#42fffe] transition-colors disabled:opacity-50"
            >
              {loading ? "..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
