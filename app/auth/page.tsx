"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { API_BASE_URL } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { TokenManager } from "@/lib/token-refresh"

function AuthPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("")
  const [signupFirstName, setSignupFirstName] = useState("")
  const [signupLastName, setSignupLastName] = useState("")
  const [activeTab, setActiveTab] = useState("login")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    
    try {
      // First, authenticate with backend to get tokens
      const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      if (!loginRes.ok) {
        const errorData = await loginRes.json();
        throw new Error(errorData.message || "Invalid credentials");
      }

      const { accessToken, refreshToken, ...userData } = await loginRes.json();
      
      // Store refresh token securely
      TokenManager.setRefreshToken(refreshToken);
      
      // Use NextAuth for session management
      const result = await signIn("credentials", {
        redirect: false,
        email: loginEmail,
        password: loginPassword,
        callbackUrl,
      });
      
      if (result?.error) {
        setError(result.error)
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: result.error === "CredentialsSignin" ? "Invalid email or password" : result.error,
        })
      } else if (result?.url) {
        toast({
          title: "Login Successful!",
          description: "Welcome back! Redirecting to your dashboard...",
        })
        setTimeout(() => {
          if (result.url) {
            window.location.href = result.url
          }
        }, 1000)
      }
    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred during login."
      setError(errorMessage)
      toast({
        variant: "destructive",
        title: "Login Error",
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    
    if (signupPassword !== signupConfirmPassword) {
      const errorMessage = "Passwords do not match."
      setError(errorMessage)
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: errorMessage,
      })
      setIsLoading(false)
      return
    }
    
    if (signupPassword.length < 8) {
      const errorMessage = "Password must be at least 8 characters long."
      setError(errorMessage)
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: errorMessage,
      })
      setIsLoading(false)
      return
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signupEmail,
          password: signupPassword,
          firstName: signupFirstName,
          lastName: signupLastName,
        }),
      })
      
      if (!response.ok) {
        const data = await response.json()
        const errorMessage = data.message || "Signup failed"
        setError(errorMessage)
        toast({
          variant: "destructive",
          title: "Signup Failed",
          description: errorMessage,
        })
        return
      }
      
      // Show success message for signup
      toast({
        title: "Account Created Successfully!",
        description: "Please log in with your new credentials.",
      })
      
      // Clear signup form
      setSignupEmail("")
      setSignupPassword("")
      setSignupConfirmPassword("")
      setSignupFirstName("")
      setSignupLastName("")
      
      // Redirect to login tab after a short delay
      setTimeout(() => {
        setActiveTab("login")
        // Focus on email input for better UX
        const emailInput = document.getElementById("login-email")
        if (emailInput) {
          emailInput.focus()
        }
      }, 1500)
    } catch (err: any) {
      const errorMessage = "An unexpected error occurred during signup."
      setError(errorMessage)
      toast({
        variant: "destructive",
        title: "Signup Error",
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Access your trading dashboard.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input 
                      id="login-email" 
                      type="email" 
                      value={loginEmail} 
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <PasswordInput 
                      id="login-password" 
                      value={loginPassword} 
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      placeholder="Enter your password"
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Create your IVREX trading account.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input 
                        id="first-name" 
                        value={signupFirstName} 
                        onChange={(e) => setSignupFirstName(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input 
                        id="last-name" 
                        value={signupLastName} 
                        onChange={(e) => setSignupLastName(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input 
                      id="signup-email" 
                      type="email" 
                      value={signupEmail} 
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <PasswordInput 
                      id="signup-password" 
                      value={signupPassword} 
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      minLength={8}
                      placeholder="Create a strong password"
                    />
                    <p className="text-xs text-muted-foreground">Minimum 8 characters required</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <PasswordInput 
                      id="confirm-password" 
                      value={signupConfirmPassword} 
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      minLength={8}
                      placeholder="Confirm your password"
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <AuthPageContent />
    </Suspense>
  )
}