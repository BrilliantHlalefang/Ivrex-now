"use client"

import { useState, useEffect, Suspense } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Upload, AlertCircle, X, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getActiveSubscriptions, cancelSubscription } from "@/lib/api"

function SubscriptionPaymentPageContent() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // Redirect to login if not authenticated
      window.location.href = "/auth"
    },
  })
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const serviceName = searchParams.get("service") || "IVREX Pro"
  const servicePrice = searchParams.get("price") || "$99/mo"
  
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "ecocash">("mpesa")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [fullName, setFullName] = useState("")
  const [receiptImage, setReceiptImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [existingSubscriptions, setExistingSubscriptions] = useState<any[]>([])
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(true)
  
  useEffect(() => {
    if (session?.user?.name) {
      setFullName(session.user.name);
    }
  }, [session]);

  // Check for existing subscriptions
  useEffect(() => {
    if (session?.accessToken) {
      checkExistingSubscriptions();
    }
  }, [session]);

  const checkExistingSubscriptions = async () => {
    setLoadingSubscriptions(true);
    try {
      const subscriptions = await getActiveSubscriptions();
      setExistingSubscriptions(subscriptions);
    } catch (error) {
      // Silently handle subscription fetch error - not critical for user experience
      toast({
        title: "Notice",
        description: "Unable to check existing subscriptions. You can still proceed with your purchase.",
        variant: "default",
      });
    } finally {
      setLoadingSubscriptions(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    try {
      await cancelSubscription(subscriptionId);
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled successfully.",
      });
      // Refresh the subscriptions list
      await checkExistingSubscriptions();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Cancellation Failed",
        description: error.response?.data?.message || "Unable to cancel subscription. Please contact support if this persists.",
      });
    }
  };

  // Get subscription type mapping
  const getSubscriptionType = (serviceName: string): string => {
    const mapping: { [key: string]: string } = {
      "Trading Signals": "trading_signals",
      "Copy Trading Access": "copy_trading", 
      "Advanced Analytics": "advanced_analytics",
      "Personal Coaching": "personal_coaching",
      "IVREX Pro": "ivrex_pro",
      "Shares Challenge Consultation": "shares_challenge",
    };
    return mapping[serviceName] || "ivrex_pro";
  };

  // Check if user has existing subscription for the current service
  const currentServiceType = getSubscriptionType(serviceName);
  const hasExistingSubscription = existingSubscriptions.some(sub => 
    sub.type === currentServiceType && sub.status === 'active'
  );

  // Smart routing: redirect if user already has the subscription
  useEffect(() => {
    if (!loadingSubscriptions && hasExistingSubscription) {
      toast({
        title: "Already Subscribed",
        description: `You already have an active subscription for ${serviceName}. Redirecting to dashboard.`,
      });
      
      // Redirect to the appropriate service page or dashboard
      const serviceUrls: { [key: string]: string } = {
        'trading_signals': '/dashboard?tab=signals',
        'copy_trading': '/dashboard?tab=copy-trading', 
        'advanced_analytics': '/dashboard?tab=analytics',
        'personal_coaching': '/dashboard?tab=coaching',
        'shares_challenge': '/dashboard?tab=challenges',
        'ivrex_pro': '/dashboard'
      };
      
      const redirectUrl = serviceUrls[currentServiceType] || '/dashboard';
      setTimeout(() => router.push(redirectUrl), 2000);
    }
  }, [hasExistingSubscription, loadingSubscriptions, serviceName, currentServiceType, router, toast]);

  // Debugging state
  useEffect(() => {
    console.log("State changed:", {
      fullName,
      phoneNumber,
      receiptImage: !!receiptImage,
      isSubmitting,
      isButtonDisabled: isSubmitting || !phoneNumber || !fullName || !receiptImage,
    });
  }, [fullName, phoneNumber, receiptImage, isSubmitting]);

  if (status === "loading" || loadingSubscriptions) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-3xl text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p>{status === "loading" ? "Loading session..." : "Checking subscription status..."}</p>
        </div>
      </div>
    );
  }

  // Show redirect message if user has existing subscription
  if (hasExistingSubscription) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-3xl text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold">Already Subscribed!</h2>
          <p className="text-muted-foreground max-w-md">
            You already have an active subscription for {serviceName}. Redirecting you to access your service...
          </p>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const merchantDetails = {
    mpesa: {
      merchantNumber: "53031435",
      merchantName: "Cletus Lieta"
    },
    ecocash: {
      merchantNumber: "62495272",
      merchantName: "Kopano Mabusa"
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload a receipt image smaller than 5MB.",
        })
        return
      }
      setReceiptImage(file)
      const fileReader = new FileReader()
      fileReader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      fileReader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptImage) {
      toast({
        variant: "destructive",
        title: "Receipt Required",
        description: "Please upload a payment receipt to continue.",
      })
      return;
    }
    setIsSubmitting(true);

    // Get additional URL parameters
    const subscriptionType = searchParams.get("type") || "ivrex_pro"
    const challengeId = searchParams.get("challengeId")

    const formData = new FormData();
    formData.append('serviceName', serviceName);
    formData.append('type', subscriptionType);
    formData.append('price', servicePrice.replace(/[^0-9.]/g, ''));
    formData.append('paymentMethod', paymentMethod);
    formData.append('paymentPhoneNumber', phoneNumber);
    formData.append('receipt', receiptImage);

    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create subscription.');
      }
      
      const subscription = await response.json();
      
      // If this is a challenge-related subscription, link it to the challenge
      if (challengeId && subscription.id) {
        try {
          await fetch('/api/challenges/link-subscription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              challengeId,
              subscriptionId: subscription.id,
            }),
          });
        } catch (linkError) {
          // Don't fail the whole process if linking fails - this is a background operation
        }
      }
      
      toast({
        title: "Subscription Submitted!",
        description: "Your payment is being verified. We'll notify you once it's active.",
      });
      
      router.push("/dashboard?subscription=pending");

    } catch (error: any) {
      // Handle specific error for existing active subscription
      if (error.message.includes('already has an active subscription')) {
        await checkExistingSubscriptions(); // Refresh the subscriptions list
        toast({
          variant: "destructive",
          title: "Active Subscription Found",
          description: "You already have an active subscription for this service. Please cancel your existing subscription above to create a new one.",
        });
        return;
      }
      
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Subscription Payment</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
          <CardDescription>You are subscribing to the following service</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-semibold text-xl">{serviceName}</h2>
              <p className="text-muted-foreground">{servicePrice}</p>
            </div>
            <div className="text-xl font-bold">{servicePrice}</div>
          </div>
        </CardContent>
      </Card>

      {/* Show existing subscription warning */}
      {!loadingSubscriptions && hasExistingSubscription && (
        <Alert className="mb-6 border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Active Subscription Found</AlertTitle>
          <AlertDescription className="text-amber-700">
            You already have an active subscription for {serviceName}. You can cancel your existing subscription below if you need to update your payment details or make changes.
            
            <div className="mt-3 space-y-2">
              {existingSubscriptions
                .filter(sub => sub.type === currentServiceType && sub.status === 'active')
                .map(subscription => (
                  <div key={subscription.id} className="flex items-center justify-between p-3 bg-white rounded-md border border-amber-200">
                    <div>
                      <p className="font-medium text-amber-800">
                        {serviceName} - ${subscription.price}/mo
                      </p>
                      <p className="text-xs text-amber-600">
                        Expires: {new Date(subscription.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleCancelSubscription(subscription.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                ))}
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Select your preferred payment method</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'mpesa' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                onClick={() => setPaymentMethod('mpesa')}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium">M-Pesa</div>
                  <div className={`w-4 h-4 rounded-full ${paymentMethod === 'mpesa' ? 'bg-primary' : 'border border-gray-400'}`}></div>
                </div>
              </div>
              
              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'ecocash' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                onClick={() => setPaymentMethod('ecocash')}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium">EcoCash</div>
                  <div className={`w-4 h-4 rounded-full ${paymentMethod === 'ecocash' ? 'bg-primary' : 'border border-gray-400'}`}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Merchant Details</CardTitle>
            <CardDescription>Send payment to this account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Merchant Number</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input 
                    value={merchantDetails[paymentMethod].merchantNumber} 
                    readOnly 
                    className="font-mono bg-muted"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText(merchantDetails[paymentMethod].merchantNumber)
                      toast({ title: "Copied to clipboard!" })
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                  </Button>
                </div>
              </div>
              <div>
                <Label>Merchant Name</Label>
                <Input 
                  value={merchantDetails[paymentMethod].merchantName} 
                  readOnly 
                  className="bg-muted"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Payment Confirmation</CardTitle>
            <CardDescription>Please fill in your details and upload your payment receipt</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number Used</Label>
                <Input 
                  id="phoneNumber" 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)} 
                  placeholder="+254..." 
                  required 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Account Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={session?.user?.email || ""} 
                readOnly 
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">This email is tied to your account.</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="receipt">Payment Receipt</Label>
              <div className="border border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => document.getElementById('receipt')?.click()}>
                <input 
                  id="receipt" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="hidden"
                />
                {previewUrl ? (
                  <div className="relative h-40 w-full">
                    <Image
                      src={previewUrl}
                      alt="Receipt preview" 
                      fill
                      style={{objectFit: "contain"}}
                      className="rounded-md"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="absolute top-2 right-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        setReceiptImage(null)
                        setPreviewUrl(null)
                        const input = document.getElementById('receipt') as HTMLInputElement;
                        if(input) input.value = '';
                      }}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload a screenshot of your payment receipt
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <Alert className="bg-primary/5 border-primary/20">
              <Info className="h-4 w-4 text-primary" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription className="text-sm">
                Your subscription will be activated once payment is verified (usually within a few hours).
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || !phoneNumber || !fullName || !receiptImage || hasExistingSubscription}
            >
              {isSubmitting ? "Submitting..." : hasExistingSubscription ? "Cancel Existing Subscription First" : "Confirm & Submit Receipt"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

export default function SubscriptionPaymentPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <SubscriptionPaymentPageContent />
    </Suspense>
  )
}
