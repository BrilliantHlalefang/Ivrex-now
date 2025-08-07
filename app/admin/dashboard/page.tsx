"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Subscription } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { Input } from "@/components/ui/input";

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<any | null>(null);
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] = useState(false);
  const [isChallengeReviewDialogOpen, setIsChallengeReviewDialogOpen] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState("");
  const [challengeNotes, setChallengeNotes] = useState("");
  const [googleMeetLink, setGoogleMeetLink] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    }

    if (status === "authenticated" && session.user?.role !== "admin") {
      router.push("/dashboard");
    }
    
    if (status === "authenticated" && session.user?.role === "admin") {
      fetchData();
    }
  }, [session, status, router]);

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("/subscriptions");
      setSubscriptions(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch subscriptions.");
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to fetch subscriptions.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChallenges = async () => {
    try {
      const response = await api.get("/challenges/pending");
      setChallenges(response.data);
    } catch (err: any) {
      console.error("Failed to fetch challenges:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to fetch challenges.",
      });
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([fetchSubscriptions(), fetchChallenges()]);
    } catch (err: any) {
      setError(err.message || "Failed to fetch data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyClick = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setVerificationNotes("");
    setIsVerificationDialogOpen(true);
  };

  const handleVerificationSubmit = async (approved: boolean) => {
    if (!selectedSubscription) return;

    try {
      await api.post(`/subscriptions/${selectedSubscription.id}/verify`, {
        approved,
        notes: verificationNotes,
      });

      toast({
        title: "Success",
        description: `Subscription has been ${approved ? "approved" : "rejected"}.`,
      });

      fetchData(); // Re-fetch to update the lists
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: err.message || "An error occurred.",
      });
    } finally {
      setIsVerificationDialogOpen(false);
      setSelectedSubscription(null);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'yellow';
      case 'active': return 'green';
      case 'payment_failed': return 'red';
      case 'expired': return 'gray';
      case 'cancelled': return 'gray';
      default: return 'default';
    }
  };

  const pendingSubscriptions = subscriptions.filter(sub => sub.status === 'pending');

  const handleChallengeReviewClick = (challenge: any) => {
    setSelectedChallenge(challenge);
    setChallengeNotes("");
    setGoogleMeetLink("");
    setIsChallengeReviewDialogOpen(true);
  };

  const handleChallengeReviewSubmit = async (approved: boolean) => {
    if (!selectedChallenge) return;

    try {
      const reviewData: any = {
        approved,
        adminNotes: challengeNotes,
      };

      if (approved && googleMeetLink) {
        reviewData.googleMeetLink = googleMeetLink;
      }

      await api.post(`/challenges/${selectedChallenge.id}/review`, reviewData);

      toast({
        title: "Success",
        description: `Challenge has been ${approved ? "approved" : "rejected"}.`,
      });

      fetchData(); // Re-fetch to update the lists
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Review Failed",
        description: err.message || "An error occurred.",
      });
    } finally {
      setIsChallengeReviewDialogOpen(false);
      setSelectedChallenge(null);
    }
  };

  const generateGoogleMeetLink = () => {
    const meetLink = "https://meet.google.com/new";
    setGoogleMeetLink(meetLink);
    
    // Open in new tab for admin to create the actual meeting
    window.open(meetLink, "_blank");
    
    toast({
      title: "Google Meet",
      description: "A new meeting tab has been opened. Copy the meeting link and paste it in the field below.",
    });
  };

  if (isLoading) {
    return <div className="container mx-auto py-10">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle>Pending Subscriptions</CardTitle>
          <CardDescription>
            These subscriptions are awaiting verification. You can only see subscriptions for payment methods you are responsible for.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Submitted On</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingSubscriptions.length > 0 ? (
                pendingSubscriptions.map(sub => (
                  <TableRow key={sub.id}>
                    <TableCell>{sub.user?.email || 'N/A'}</TableCell>
                    <TableCell>{sub.type}</TableCell>
                    <TableCell>{new Date(sub.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{sub.paymentMethod}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(sub.status) as any}>{sub.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => handleVerifyClick(sub)}>
                        Review & Verify
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No pending subscriptions.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pending Challenges */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Pending Challenges</CardTitle>
          <CardDescription>
            These challenges are awaiting review for approval or rejection.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Screenshot</TableHead>
                <TableHead>Submitted On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {challenges.length > 0 ? (
                challenges.map(challenge => (
                  <TableRow key={challenge.id}>
                    <TableCell>{challenge.user?.email || 'N/A'}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={challenge.description}>
                        {challenge.description.length > 50 
                          ? `${challenge.description.substring(0, 50)}...` 
                          : challenge.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      {challenge.screenshotPath ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${challenge.screenshotPath}`, '_blank')}
                        >
                          View
                        </Button>
                      ) : (
                        <span className="text-muted-foreground">No image</span>
                      )}
                    </TableCell>
                    <TableCell>{new Date(challenge.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={
                        challenge.status === 'submitted' ? 'secondary' :
                        challenge.status === 'under_review' ? 'outline' :
                        challenge.status === 'approved' ? 'default' : 'destructive'
                      }>
                        {challenge.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => handleChallengeReviewClick(challenge)}>
                        Review Challenge
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No pending challenges.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Verification Dialog */}
      <Dialog open={isVerificationDialogOpen} onOpenChange={setIsVerificationDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Verify Payment</DialogTitle>
            <DialogDescription>
              Review the payment receipt and approve or reject the subscription.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            {selectedSubscription?.receiptImagePath && (
              <div>
                <Label>Receipt</Label>
                <div className="mt-2 border rounded-md p-2">
                   <Image
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${selectedSubscription.receiptImagePath}`}
                    alt="Payment Receipt"
                    width={400}
                    height={400}
                    className="rounded-md object-contain"
                  />
                </div>
              </div>
            )}
            <div>
              <Label htmlFor="verification-notes">Notes (Optional)</Label>
              <Textarea
                id="verification-notes"
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                placeholder="e.g., Confirmed payment with user via phone."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVerificationDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => handleVerificationSubmit(false)}>Reject</Button>
            <Button onClick={() => handleVerificationSubmit(true)}>Approve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Challenge Review Dialog */}
      <Dialog open={isChallengeReviewDialogOpen} onOpenChange={setIsChallengeReviewDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Challenge</DialogTitle>
            <DialogDescription>
              Review the challenge submission and approve or reject it.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            {selectedChallenge && (
              <div>
                <Label>Challenge Details</Label>
                <div className="mt-2 p-4 bg-muted rounded-md">
                  <p className="text-sm font-medium mb-2">User: {selectedChallenge.user?.email}</p>
                  <p className="text-sm mb-2">Submitted: {new Date(selectedChallenge.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm mb-2">Description:</p>
                  <p className="text-sm text-muted-foreground">{selectedChallenge.description}</p>
                  {selectedChallenge.screenshotPath && (
                    <div className="mt-4">
                      <p className="text-sm mb-2">Screenshot:</p>
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${selectedChallenge.screenshotPath}`}
                        alt="Challenge Screenshot"
                        className="max-w-full h-48 object-contain border rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div>
              <Label htmlFor="google-meet-link">Google Meet Link (Required for Approval)</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="google-meet-link"
                  value={googleMeetLink}
                  onChange={(e) => setGoogleMeetLink(e.target.value)}
                  placeholder="Paste Google Meet link here"
                  className="flex-1"
                />
                <Button variant="outline" onClick={generateGoogleMeetLink}>
                  Generate
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Click Generate to create a new Google Meet session, then copy and paste the link here.
              </p>
            </div>
            
            <div>
              <Label htmlFor="challenge-notes">Admin Notes (Optional)</Label>
              <Textarea
                id="challenge-notes"
                value={challengeNotes}
                onChange={(e) => setChallengeNotes(e.target.value)}
                placeholder="Add any notes about your decision..."
                rows={3}
              />
            </div>
          </div>
   
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChallengeReviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => handleChallengeReviewSubmit(false)}
            >
              Reject
            </Button>
            <Button 
              onClick={() => handleChallengeReviewSubmit(true)}
              disabled={!googleMeetLink.trim()}
            >
              Approve & Create Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 