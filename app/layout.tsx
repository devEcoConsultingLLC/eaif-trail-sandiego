import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"

const poppins = localFont({
  src: [
    { path: "./fonts/Poppins-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Poppins-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Poppins-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/Poppins-Bold.ttf", weight: "700", style: "normal" },
  ],
})

export const metadata: Metadata = {
  title: "EDGE AI Trail... To San Diego",
  description:
    "A choose-your-own-adventure game inspired by Oregon Trail. Navigate from your airport drop-off to EDGE AI San Diego 2026!",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <a
          href="https://thedeveco.com/consultancy"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "38px",
            backgroundColor: "#0a0a0a",
            borderBottom: "1px solid rgba(55, 138, 139, 0.3)",
            textDecoration: "none",
            fontSize: "12px",
            letterSpacing: "0.02em",
            flexShrink: 0,
          }}
        >
          <span style={{ color: "#999" }}>An Experience by&nbsp;</span>
          <span style={{ color: "#5fb3b4", fontWeight: 600 }}>devEco</span>
          <span style={{ color: "#999" }}> Consulting LLC</span>
        </a>
        {children}
      </body>
    </html>
  )
}
