"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, X, User, Settings, LogOut, BarChart3 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { logoutServerSide } from "@/lib/api"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session, status } = useSession()
  const { toast } = useToast()

  // Get user initials for avatar
  const getInitials = (name?: string) => {
    return name
      ?.split(" ")
      .map(n => n[0])
      .join("") || "U";
  };

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Our Services", href: "/services" },
    { label: "Tools", href: "/#tools" },
    { label: "Support", href: "/support" },
    { label: "Real-Time Market", href: "/market-watch/real-time" },
  ]

  const handleLogout = async () => {
    try {
      toast({
        title: "Logging out...",
        description: "Securely signing you out of your account.",
      })
      
      // First invalidate token on server
      await logoutServerSide();
      
      // Then clear client-side session
      await signOut({ 
        callbackUrl: "/",
        redirect: true 
      })
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "There was an error logging you out. Please try again.",
      })
    }
  }

  const AuthSection = () => {
    if (status === "loading") {
      return (
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      )
    }

    if (session?.user) {
      // Authenticated user - show user menu
      return (
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(session.user.name || undefined)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {session.user.name || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session.user.email || "No email"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }

    // Guest user - show login/signup buttons
    return (
      <div className="flex items-center gap-2">
        <Link href="/auth">
          <Button variant="outline">Login</Button>
        </Link>
        <Link href="/auth?tab=signup">
          <Button>Sign Up</Button>
        </Link>
      </div>
    )
  }

  const MobileAuthSection = () => {
    if (status === "loading") {
      return (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      )
    }

    if (session?.user) {
      // Authenticated user - mobile menu
      return (
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center gap-3 px-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(session.user.name || undefined)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{session.user.name || "User"}</p>
              <p className="text-xs text-muted-foreground">{session.user.email}</p>
            </div>
          </div>
          
          <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
            <Button variant="outline" className="w-full justify-start">
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          
          <Link href="/dashboard/settings" onClick={() => setIsMenuOpen(false)}>
            <Button variant="outline" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => {
              setIsMenuOpen(false)
              handleLogout()
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      )
    }

    // Guest user - mobile menu
    return (
      <div className="flex flex-col gap-2 mt-4">
        <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
          <Button variant="outline" className="w-full">
            Login
          </Button>
        </Link>
        <Link href="/auth?tab=signup" onClick={() => setIsMenuOpen(false)}>
          <Button className="w-full">Sign Up</Button>
        </Link>
      </div>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo Section - Fixed width */}
        <div className="flex items-center gap-2 w-auto">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo3.png"
              alt="Ivrex Logo"
              className="h-48 w-48 rounded-full object-cover"
              loading="eager"
            />
          </Link>
        </div>

        {/* Navigation Section - Centered with proper spacing */}
        <nav className="hidden md:flex items-center gap-8 flex-1 justify-center mx-8">
          {navItems.map((item, index) => (
            <Link key={index} href={item.href} className="text-sm font-medium transition-colors hover:text-primary whitespace-nowrap">
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Auth Section - Fixed width */}
        <div className="flex items-center gap-2 w-auto">
          <div className="hidden md:flex">
            <AuthSection />
          </div>

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="text-lg font-medium transition-colors hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                
                <MobileAuthSection />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
