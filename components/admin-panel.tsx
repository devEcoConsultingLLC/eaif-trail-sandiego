"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import type { LeaderboardEntry } from "@/lib/leaderboard"

interface AdminPanelProps {
  onClose: () => void
  onLogout: () => void
}

export function AdminPanel({ onClose, onLogout }: AdminPanelProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState<LeaderboardEntry | null>(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("leaderboard")
        .select("*")
        .order("score", { ascending: false })

      if (error) throw error
      setEntries(data ?? [])
    } catch {
      setEntries([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const handleDelete = async (entry: LeaderboardEntry) => {
    try {
      await supabase.from("leaderboard").delete().eq("id", entry.id)
      setDeleteConfirm(null)
      await fetchAll()
    } catch {
      // RLS will block unauthorized deletes silently
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    onLogout()
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#00e7ad]/20 shrink-0">
        <h1 className="text-xl font-bold text-[#00e7ad]">Admin Dashboard</h1>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[#787878] hover:text-white border border-[#787878]/30 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-red-400 hover:text-red-300 border border-red-400/30 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-sm text-[#787878] mb-4">
            {entries.length} total entries
          </div>

          {loading ? (
            <p className="text-[#787878]">Loading...</p>
          ) : entries.length === 0 ? (
            <p className="text-[#787878]">No leaderboard entries.</p>
          ) : (
            <div className="bg-black/30 rounded-xl border border-[#00e7ad]/30 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#00e7ad]/20">
                    <th className="px-4 py-3 text-[#787878] font-medium">#</th>
                    <th className="px-4 py-3 text-[#787878] font-medium">Player</th>
                    <th className="px-4 py-3 text-[#787878] font-medium">Role</th>
                    <th className="px-4 py-3 text-[#787878] font-medium text-right">Score</th>
                    <th className="px-4 py-3 text-[#787878] font-medium text-right">Date</th>
                    <th className="px-4 py-3 text-[#787878] font-medium w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, i) => (
                    <tr key={entry.id} className="border-b border-[#00e7ad]/10 last:border-0 hover:bg-white/5">
                      <td className="px-4 py-3 text-[#42fffe] font-bold">
                        {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                      </td>
                      <td className="px-4 py-3 text-[#F0F0F0] font-medium">{entry.player_name}</td>
                      <td className="px-4 py-3 text-[#787878] capitalize">{entry.player_role}</td>
                      <td className="px-4 py-3 text-right text-[#fffe01] font-bold">{entry.score.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-[#787878] text-xs">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => setDeleteConfirm(entry)}
                          className="text-red-400/60 hover:text-red-400 transition-colors"
                          title="Delete entry"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/70"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="bg-[#0a0a0a] border border-red-400/30 rounded-xl p-6 w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[#F0F0F0] mb-4">
              Delete entry for <span className="text-[#00e7ad] font-bold">{deleteConfirm.player_name}</span>?
            </p>
            <p className="text-[#787878] text-xs mb-4">
              Score: {deleteConfirm.score.toLocaleString()} — This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 text-sm text-[#787878] hover:text-white border border-[#787878]/30 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 text-sm bg-red-500 text-white font-bold rounded-lg hover:bg-red-400 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
