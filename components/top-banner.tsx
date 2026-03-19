"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { AdminLogin } from "./admin-login"
import { AdminPanel } from "./admin-panel"

export function TopBanner() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          height: "38px",
          backgroundColor: "#0a0a0a",
          borderBottom: "1px solid rgba(55, 138, 139, 0.3)",
          fontSize: "12px",
          letterSpacing: "0.02em",
          flexShrink: 0,
          position: "relative",
        }}
      >
        <a
          href="https://thedeveco.com/consultancy"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <span style={{ color: "#999" }}>Experience by </span>
          <span style={{ color: "#5fb3b4", fontWeight: 600 }}>devEco</span>
          <span style={{ color: "#999" }}> Consulting LLC</span>
        </a>
        <span style={{ color: "#999" }}>|</span>
        <a
          href="https://site.pheedloop.com/event/sandiego2026/home/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <span style={{ color: "#999" }}>Register for </span>
          <span style={{ color: "#5fb3b4", fontWeight: 600 }}>EDGE AI San Diego</span>
        </a>

        {/* Admin access — subtle lock icon or admin button */}
        <button
          onClick={() => isLoggedIn ? setShowAdmin(true) : setShowLogin(true)}
          style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: isLoggedIn ? "10px" : "11px",
            color: isLoggedIn ? "#5fb3b4" : "#555",
            padding: "4px",
            lineHeight: 1,
          }}
          title={isLoggedIn ? "Open Admin Dashboard" : "Admin Login"}
        >
          {isLoggedIn ? "Admin" : "🔒"}
        </button>
      </div>

      {showLogin && (
        <AdminLogin
          onClose={() => setShowLogin(false)}
          onSuccess={() => {
            setShowLogin(false)
            setShowAdmin(true)
          }}
        />
      )}

      {showAdmin && (
        <AdminPanel
          onClose={() => setShowAdmin(false)}
          onLogout={() => {
            setIsLoggedIn(false)
            setShowAdmin(false)
          }}
        />
      )}
    </>
  )
}
