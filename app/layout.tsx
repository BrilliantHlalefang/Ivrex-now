import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import AuthSessionProvider from "@/components/auth-session-provider"
import LayoutProvider from "@/components/layout-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ivrex | Professional Trading Platform",
  description: "Professional Trading Signals, Mentorship, Pool Accounts, Copy Trading, and Deriv Payment Services",
  icons: {
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-04-23%20at%2019.13.49_90ca6a65.jpg-IeNkePg35u5CL08UkvGF9uz8s1oCjK.jpeg",
  },
  generator: 'v0.dev'
}



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthSessionProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark" disableTransitionOnChange>
            <LayoutProvider>{children}</LayoutProvider>
            <Toaster />
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  )
} 