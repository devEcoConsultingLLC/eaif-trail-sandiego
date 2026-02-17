"use client"

import { useState, useEffect } from "react"

// Target: 69 days, 5 hours, 26 minutes from a fixed reference point
const REFERENCE_DATE = new Date("2026-01-14T00:00:00Z").getTime()
const INITIAL_MS = (69 * 24 * 60 * 60 + 5 * 60 * 60 + 26 * 60) * 1000

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 69, hours: 5, minutes: 26, seconds: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now()
      const elapsed = now - REFERENCE_DATE
      const remaining = Math.max(0, INITIAL_MS - elapsed)

      const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
      const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-black/80 border-t border-[#00e7ad]/30 py-3 px-4">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="text-[#00e7ad] text-xs md:text-sm font-[Poppins]">⏱️ EDGE AI San Diego 2026 starts in:</div>
        <div className="flex gap-3 md:gap-4 font-[Poppins]">
          <TimeUnit value={timeLeft.days} label="DAYS" />
          <span className="text-[#00e7ad] text-xl animate-pulse">:</span>
          <TimeUnit value={timeLeft.hours} label="HRS" />
          <span className="text-[#00e7ad] text-xl animate-pulse">:</span>
          <TimeUnit value={timeLeft.minutes} label="MIN" />
          <span className="text-[#00e7ad] text-xl animate-pulse">:</span>
          <TimeUnit value={timeLeft.seconds} label="SEC" />
        </div>
      </div>
    </div>
  )
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="text-xl md:text-2xl font-bold text-[#42fffe] tabular-nums">{String(value).padStart(2, "0")}</div>
      <div className="text-[8px] md:text-xs text-[#787878]">{label}</div>
    </div>
  )
}
