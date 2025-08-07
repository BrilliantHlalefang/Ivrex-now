"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { API_BASE_URL } from "@/lib/api"
import { Loader2, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function SettingsPage() {
  const { data: session, update, status } = useSession()
  const router = useRouter()
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize name when session loads
  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session?.user?.name]);

  // Only refresh session if there's an actual need (e.g., after profile update)
  const refreshSessionIfNeeded = async () => {
    try {
      await update();
    } catch (error) {
      // Session refresh failed silently - not critical for user experience
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData();
    let changesMade = false;

    if (name.trim() !== session?.user?.name) {
      formData.append('name', name.trim());
      changesMade = true;
    }

    if (!changesMade) {
      toast({
        title: "No Changes",
        description: "You haven't made any changes to your profile.",
      })
      setIsSubmitting(false)
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/users/profile`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${(session as any)?.accessToken}`,
        },
        body: formData,
      })

      if (!res.ok) {
        const errorText = await res.text();
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText || `HTTP ${res.status}: ${res.statusText}` };
        }
        
        throw new Error(errorData.message || `Request failed with status ${res.status}`)
      }

      const updatedUser = await res.json()

      // Construct the full name
      const newName = updatedUser.profile ? 
        `${updatedUser.profile.firstName} ${updatedUser.profile.lastName}`.trim() : 
        (updatedUser.name || session?.user?.name);

      // Update the session with the new data - use proper format for JWT callback
      await update({
        user: {
          name: newName,
        },
      });

      // Update the local name state to match the session
      setName(newName);

      toast({
        title: "Profile Updated Successfully! ✨",
        description: "Your name has been saved and updated.",
      });

    } catch (error: any) {
      // Provide more specific error messages
      let errorMessage = "Could not save your changes. Please try again.";
      
      if (error.message.includes('401')) {
        errorMessage = "Authentication failed. Please log in again.";
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!session) {
    return <div>Loading...</div>
  }

  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map(n => n[0])
      .join("") || "U";
  };

  const hasChanges = name.trim() !== (session?.user?.name || "");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">Manage your profile information and preferences.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Profile Information
            {hasChanges && <Badge variant="secondary">Unsaved Changes</Badge>}
          </CardTitle>
          <CardDescription>This is how others will see you on the site.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Avatar Section */}
            <div className="space-y-4">
              <Label>Profile Avatar</Label>
              <div className="flex items-center gap-4">
                <Avatar className="h-24 w-24 border-2 border-border">
                  <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                    {getInitials(name || session.user?.name || "")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Your avatar is automatically generated based on your name's initials.
                  </p>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Your initials will be used for your avatar display
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={session.user?.email ?? ""} 
                  disabled 
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              {hasChanges && (
                <Button type="button" variant="outline" onClick={() => {
                  setName(session?.user?.name || "");
                }}>
                  Reset Changes
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting || !hasChanges}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}