import HeaderAuth from "@/app/(auth-pages)/_components/header-auth"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { GeistSans } from "geist/font/sans"
import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"

import "./globals.css"

export const metadata: Metadata = {
  title: "Hot Strava",
  description: "The hottest Strava client on the web",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={GeistSans.className}>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex min-h-screen flex-col items-center">
            <div className="flex w-full flex-1 flex-col items-center gap-20">
              <nav className="flex h-16 w-full justify-center border-b border-b-foreground/10">
                <div className="flex w-full max-w-5xl items-center justify-between p-3 px-5 text-sm">
                  <div className="flex items-center gap-5 font-semibold">
                    <ThemeSwitcher />
                  </div>
                  <HeaderAuth />
                </div>
              </nav>
              <div className="flex max-w-5xl flex-col gap-20 p-5">
                {children}
              </div>

              <footer className="mx-auto mt-auto flex w-full items-center justify-center gap-8 border-t py-16 text-center text-xs">
                <p>Powered by @a-pyro </p>
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
