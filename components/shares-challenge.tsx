import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { CheckCircle, ArrowRight, Video, UploadCloud, X, Signal, TrendingUp, BarChart3, UserCheck, Clock, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { api, createChallenge, getMyChallenges, linkChallengeToSubscription, checkChallengeAccess, createChallengeSimple, deleteChallenge } from "@/lib/api"
import { Challenge, ChallengeStatus, SubscriptionType } from "@/types"

interface ChallengeService {
  name: string;
  price: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
}

const challengeServices: ChallengeService[] = [
  {
    name: "Trading Signals",
    price: "$29/mo",
    description: "Receive real-time buy/sell signals from our expert analysts.",
    icon: Signal,
    features: [
      "Real-time market signals",
      "Entry & exit points",
      "Risk management alerts",
      "Performance tracking"
    ]
  },
  {
    name: "Copy Trading Access",
    price: "$49/mo", 
    description: "Automatically copy the trades of our top-performing traders.",
    icon: TrendingUp,
    features: [
      "Auto-copy expert trades",
      "Risk control settings",
      "Performance reports",
      "Multiple trader options"
    ]
  },
  {
    name: "Advanced Analytics",
    price: "$79/mo",
    description: "Unlock powerful charting tools and in-depth market analysis.",
    icon: BarChart3,
    features: [
      "Professional charting tools",
      "Market analysis reports",
      "Technical indicators",
      "Custom dashboards"
    ]
  },
  {
    name: "Personal Coaching",
    price: "$199/mo",
    description: "One-on-one sessions with a professional trading coach.",
    icon: UserCheck,
    features: [
      "1-on-1 mentorship sessions",
      "Personalized strategies",
      "Weekly progress reviews",
      "Direct expert access"
    ]
  }
]

export default function SharesChallenge({ showCardWrapper = true }: { showCardWrapper?: boolean }) {
  const router = useRouter()
  const { toast } = useToast()
  const { data: session } = useSession()
  const [challenge, setChallenge] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [step, setStep] = useState<"form" | "subscribe" | "confirmed" | "access_restricted">("form")
  const [subscriptionStatus, setSubscriptionStatus] = useState<"none" | "pending" | "active" | "rejected" | "expired">("none")
  const [challengeStatus, setChallengeStatus] = useState<ChallengeStatus | null>(null)
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasRedirected, setHasRedirected] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const removeImage = () => {
    setImage(null)
    setImagePreview(null)
  }

  // Check challenge and subscription status when component mounts
  useEffect(() => {
    if (session?.accessToken) {
      checkChallengeAndSubscriptionStatus()
      
      // Poll for status updates every 5 seconds when pending
      const interval = setInterval(() => {
        if (session?.accessToken && (subscriptionStatus === 'pending' || challengeStatus === ChallengeStatus.SUBMITTED || challengeStatus === ChallengeStatus.UNDER_REVIEW)) {
          checkChallengeAndSubscriptionStatus()
        }
      }, 5000)
      
      return () => clearInterval(interval)
    }
  }, [session, subscriptionStatus, challengeStatus])

  const checkChallengeAndSubscriptionStatus = async () => {
    try {
      // Check user's challenge submissions
      const challenges = await getMyChallenges()
      const latestChallenge = challenges.find((c: Challenge) => c.status !== ChallengeStatus.REJECTED) || challenges[0]
      
      if (latestChallenge) {
        setCurrentChallenge(latestChallenge)
        setChallengeStatus(latestChallenge.status)
        
        // Check associated subscription
        if (latestChallenge.subscription) {
          const sub = latestChallenge.subscription
          const previousSubscriptionStatus = subscriptionStatus
          
          if (sub.status === 'active') {
            setSubscriptionStatus('active')
            
            if (latestChallenge.status === ChallengeStatus.APPROVED) {
              setStep('confirmed')
              
              // Check if user has Google Meet link or should create one
              if (latestChallenge.googleMeetLink && previousSubscriptionStatus === 'pending' && !hasRedirected) {
                setHasRedirected(true)
                proceedToGoogleMeet(latestChallenge.googleMeetLink)
              }
            }
          } else if (sub.status === 'pending') {
            setSubscriptionStatus('pending')
            setStep('subscribe')
          } else if (sub.status === 'payment_failed') {
            setSubscriptionStatus('rejected')
            if (latestChallenge.status === ChallengeStatus.REJECTED) {
              setStep('access_restricted')
            }
          } else if (sub.status === 'expired' || sub.status === 'cancelled') {
            setSubscriptionStatus('expired')
            setStep('subscribe')
          }
        } else {
          // Challenge exists but no subscription linked yet
          if (latestChallenge.status === ChallengeStatus.SUBMITTED || latestChallenge.status === ChallengeStatus.UNDER_REVIEW) {
            setStep('subscribe')
          }
        }
      }
      
      // Check if user has access to approved challenges
      const accessCheck = await checkChallengeAccess()
      setHasAccess(accessCheck.hasAccess)
      
    } catch (error: any) {
      // Handle authentication errors
      if (error.response?.status === 401) {
        // Don't show error to user for auth issues, just silently fail
        return
      }
      
      // For other errors, show a toast
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load challenge status. Please refresh the page.",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('Form submission debug:', {
      challenge: challenge,
      challengeLength: challenge.length,
      challengeTrimmed: challenge.trim(),
      challengeTrimmedLength: challenge.trim().length,
      image: image,
      hasImage: !!image
    });
    
    if (challenge.trim().length < 10) {
      toast({
        variant: "destructive",
        title: "Challenge Required",
        description: "Please provide a challenge description of at least 10 characters.",
      })
      return
    }
    
    setIsLoading(true)
    
    try {
      // Test with simple creation first
      console.log('Testing simple challenge creation with description:', challenge.trim());
      console.log('Image check - hasImage:', !!image, 'will use simple endpoint:', !image);
      
      if (!image) {
        // Try simple creation without file
        console.log('Using simple endpoint with description:', challenge.trim());
        const createdChallenge = await createChallengeSimple(challenge.trim());
        setCurrentChallenge(createdChallenge);
        setChallengeStatus(createdChallenge.status);
        
        toast({
          title: "Challenge Submitted!",
          description: "Your trading challenge has been submitted. Now subscribe to get expert help.",
        });
        
        setStep("subscribe");
        return;
      }
      
      // Original file upload logic
      console.log('Using file upload endpoint with description:', challenge.trim());
      const formData = new FormData();
      formData.append('description', challenge.trim());
      if (image) {
        formData.append('screenshot', image);
      }
      
      const createdChallenge = await createChallenge(formData);
      setCurrentChallenge(createdChallenge);
      setChallengeStatus(createdChallenge.status);
      
      toast({
        title: "Challenge Submitted!",
        description: "Your trading challenge has been submitted. Now subscribe to get expert help.",
      });
      
      setStep("subscribe");
      
    } catch (error: any) {
      
      // Handle specific error for existing active challenge
      if (error.response?.status === 400 && error.response?.data?.message?.includes('active challenge submission')) {
        await checkChallengeAndSubscriptionStatus() // Refresh the current state
        toast({
          variant: "destructive",
          title: "Active Challenge Found",
          description: "You already have an active challenge. Please check your existing challenge or delete it to submit a new one.",
        })
        return
      }
      
      const errorMessage = error.response?.data?.message || error.message || "Failed to submit your challenge. Please try again."
      
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubscribe = () => {
    const isRenewal = subscriptionStatus === "expired"
    
    toast({
      title: isRenewal ? "Renewing Subscription" : "Redirecting to Payment Processing",
      description: isRenewal 
        ? "Taking you to renew your consultation subscription..." 
        : "Taking you to complete your subscription payment...",
    })
    
    // Reset redirect flag for renewals
    if (isRenewal) {
      setHasRedirected(false)
    }
    
    // Include challenge ID in the redirect for linking after payment
    const challengeParam = currentChallenge ? `&challengeId=${currentChallenge.id}` : ''
    
    // Redirect to payment processing page with shares challenge service
    router.push(`/subscription-payment?service=${encodeURIComponent("Shares Challenge Consultation")}&price=${encodeURIComponent("$99")}&type=shares_challenge&source=challenge${isRenewal ? "&renewal=true" : ""}${challengeParam}`)
  }

  const proceedToGoogleMeet = (meetLink?: string) => {
    const meetUrl = meetLink || "https://meet.google.com/new"
    
    toast({
      title: "Approved! Redirecting to Google Meet",
      description: "Your challenge has been approved. Taking you to start your consultation session...",
    })
    
    // Redirect to Google Meet automatically
    setTimeout(() => {
      window.open(meetUrl, "_blank")
    }, 2000) // 2 second delay to show the toast message
  }

  const restartChallengeProcess = async () => {
    if (currentChallenge && (currentChallenge.status === ChallengeStatus.SUBMITTED || currentChallenge.status === ChallengeStatus.UNDER_REVIEW)) {
      try {
        await deleteChallenge(currentChallenge.id)
        toast({
          title: "Previous Challenge Deleted",
          description: "Your previous challenge has been removed. You can now submit a new one.",
        })
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete previous challenge. Please try again or contact support.",
        })
        return
      }
    }
    
    setStep("form")
    setSubscriptionStatus("none")
    setChallengeStatus(null)
    setCurrentChallenge(null)
    setChallenge("")
    setImage(null)
    setImagePreview(null)
    setHasRedirected(false)
    
    toast({
      title: "Challenge Reset",
      description: "You can now submit a new trading challenge.",
    })
  }

  const createGoogleMeetLink = () => {
    const meetUrl = "https://meet.google.com/new"
    window.open(meetUrl, "_blank")
    
    toast({
      title: "Google Meet Created",
      description: "Your consultation session link has been generated. Share this with your expert.",
    })
  }

  const renderContent = () => {
    switch (step) {
      case "form":
        return (
          <div className="space-y-6">
            {/* Show existing challenges if any */}
            {currentChallenge && (currentChallenge.status === ChallengeStatus.SUBMITTED || currentChallenge.status === ChallengeStatus.UNDER_REVIEW || currentChallenge.status === ChallengeStatus.APPROVED) && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-800">Existing Challenge Found</h4>
                      <p className="text-sm text-amber-700 mt-1">
                        You have an active challenge: "{currentChallenge.description?.substring(0, 100)}..."
                      </p>
                      <p className="text-xs text-amber-600 mt-1">
                        Status: <span className="font-medium capitalize">{currentChallenge.status.replace('_', ' ')}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  {currentChallenge.status === ChallengeStatus.SUBMITTED || currentChallenge.status === ChallengeStatus.UNDER_REVIEW ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => restartChallengeProcess()}
                      className="text-amber-700 border-amber-300 hover:bg-amber-100"
                    >
                      Delete & Start New Challenge
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setStep("subscribe")}
                      className="text-amber-700 border-amber-300 hover:bg-amber-100"
                    >
                      Go to Subscription
                    </Button>
                  )}
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="challenge-description" className="text-lg font-semibold">
                  1. Describe Your Trading Challenge
                </Label>
              <p className="text-sm text-muted-foreground mb-2">
                Provide as much detail as possible for the best analysis.
              </p>
              <Textarea
                id="challenge-description"
                placeholder="e.g., 'I'm struggling to identify correct entry points...'"
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="challenge-image" className="text-lg font-semibold">
                2. Upload a Screenshot (Optional)
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                A picture of your chart can help our experts understand your issue.
              </p>
              {imagePreview ? (
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Challenge preview"
                    className="rounded-md max-h-60 w-full object-contain border bg-muted"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor="challenge-image"
                  className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/40 hover:bg-muted/60 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-1 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG or GIF</p>
                  </div>
                  <Input
                    id="challenge-image"
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                    accept="image/png, image/jpeg, image/gif"
                  />
                </label>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={challenge.trim().length < 10 && !image}
            >
              Submit Challenge & See Solutions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>
        )
      case "subscribe":
        return (
          <div className="text-center">
            {subscriptionStatus === "pending" ? (
              // Show pending approval status
              <div>
                <div className="mx-auto bg-yellow-100 p-3 rounded-full w-fit mb-4">
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold">Payment Submitted - Awaiting Approval</h3>
                <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
                  Your payment has been submitted and is currently being reviewed by our admin team. You'll be notified once approved and can then create your consultation session.
                </p>
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    <strong>Next Steps:</strong> Once approved, you'll be able to create a Google Meet link for your expert consultation session.
                  </p>
                </div>
              </div>
            ) : subscriptionStatus === "rejected" ? (
              // Show rejected status
              <div>
                <div className="mx-auto bg-red-100 p-3 rounded-full w-fit mb-4">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold">Payment Not Approved</h3>
                <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
                  Unfortunately, your payment could not be verified. Please try subscribing again with a valid payment receipt.
                </p>
                                 <Button onClick={handleSubscribe} size="lg" className="mt-6">
                   Try Again - Subscribe ($99)
                 </Button>
               </div>
             ) : subscriptionStatus === "expired" ? (
               // Show expired subscription status
               <div>
                 <div className="mx-auto bg-orange-100 p-3 rounded-full w-fit mb-4">
                   <AlertCircle className="h-8 w-8 text-orange-600" />
                 </div>
                 <h3 className="text-xl font-semibold">Subscription Expired</h3>
                 <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
                   Your previous consultation session has expired. Subscribe again to get expert help with your new trading challenges.
                 </p>
                 <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-md">
                   <p className="text-sm text-orange-800">
                     <strong>Renew Your Access:</strong> Start a new subscription to continue getting personalized trading consultation sessions.
                   </p>
                 </div>
                                   <div className="space-y-3 mt-6">
                    <Button onClick={handleSubscribe} size="lg" className="w-full">
                      Renew Subscription - $99
                    </Button>
                    <Button onClick={restartChallengeProcess} variant="outline" size="sm" className="w-full">
                      Submit New Challenge Instead
                    </Button>
                  </div>
                </div>
             ) : (
              // Show initial subscription option
              <div>
                <h3 className="text-xl font-semibold">Your Challenge Has Been Submitted!</h3>
                <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
                  Ready for expert help? Subscribe to get personalized one-on-one consultation to solve your trading challenge.
                </p>
                
                {challenge.trim() && (
                  <Card className="mt-4 text-left p-4 bg-muted/50">
                    <div className="mb-4">
                      <p className="font-semibold">Your Challenge Description:</p>
                      <p className="text-sm text-muted-foreground italic">"{challenge}"</p>
                    </div>
                    {imagePreview && (
                      <div>
                        <p className="font-semibold">Your Uploaded Screenshot:</p>
                        <div className="mt-2 rounded-md border overflow-hidden">
                          <img
                            src={imagePreview}
                            alt="Challenge submission preview"
                            className="max-h-48 w-full object-contain"
                          />
                        </div>
                      </div>
                    )}
                  </Card>
                )}
                
                <Button onClick={handleSubscribe} size="lg" className="mt-6">
                  Subscribe & Get Expert Help ($99)
                </Button>
              </div>
            )}
          </div>
        )
      case "confirmed":
        return (
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Challenge Approved - Session Active!</h3>
            <p className="text-muted-foreground mt-2 mb-6">
              Your challenge has been approved! {currentChallenge?.googleMeetLink ? 'Join your consultation session.' : 'Create a Google Meet link for your expert consultation.'}
            </p>
            
            <div className="space-y-4">
              {currentChallenge?.googleMeetLink ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-md mb-4">
                  <p className="text-sm text-green-800 mb-2">
                    <strong>Your Consultation Session:</strong>
                  </p>
                  <a 
                    href={currentChallenge.googleMeetLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Join Meeting: {currentChallenge.googleMeetLink}
                  </a>
                </div>
              ) : (
                <div className="p-4 bg-green-50 border border-green-200 rounded-md mb-4">
                  <p className="text-sm text-green-800">
                    <strong>Next Step:</strong> Create a Google Meet link and share it with your expert for your personalized consultation.
                  </p>
                </div>
              )}
              
              <Button onClick={createGoogleMeetLink} size="lg" className="w-full">
                <Video className="mr-2 h-4 w-4" />
                Create New Google Meet Session
              </Button>
            </div>
          </div>
        )
      case "access_restricted":
        return (
          <div className="text-center">
            <div className="mx-auto bg-red-100 p-3 rounded-full w-fit mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold">Access Restricted</h3>
            <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
              Your challenge submission has been reviewed and unfortunately was not approved. Your access to consultation services has been restricted.
            </p>
            {currentChallenge?.adminNotes && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">
                  <strong>Admin Notes:</strong> {currentChallenge.adminNotes}
                </p>
              </div>
            )}
            <div className="mt-6">
              <Button onClick={restartChallengeProcess} variant="outline" size="lg">
                Submit New Challenge
              </Button>
            </div>
          </div>
        )
    }
  }

  const content = (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Expert Consultation & Services</h3>
        <p className="text-sm text-muted-foreground">
          Get personalized help and access professional trading services.
        </p>
      </div>
      {renderContent()}
    </div>
  )

  if (!showCardWrapper) {
    return content
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expert Consultation & Services</CardTitle>
        <CardDescription>Get personalized help and access professional trading services.</CardDescription>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  )
} 