'use client';

import { useState, useEffect } from 'react';
import CreateSignalForm from '@/components/admin/signals/create-signal-form';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getActiveSignals, getSignalHistory, closeSignal } from '@/lib/api';
import { Signal } from '@/types';
import ActiveSignals from '@/components/signals/active-signals';
import SignalHistory from '@/components/signals/signal-history';
import { useToast } from '@/components/ui/use-toast';

export default function AdminSignalsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeSignals, setActiveSignals] = useState<Signal[]>([]);
  const [signalHistory, setSignalHistory] = useState<Signal[]>([]);
  const { toast } = useToast();

  const fetchSignals = async () => {
    try {
      const active = await getActiveSignals();
      setActiveSignals(active);

      const history = await getSignalHistory();
      setSignalHistory(history);
    } catch (error: any) {
      console.error("Failed to fetch signals:", error);
      toast({
        variant: "destructive",
        title: "Failed to Load Signals",
        description: "Unable to fetch trading signals. Please try refreshing the page.",
      });
    }
  };

  const handleCloseSignal = async (id: string) => {
    try {
      await closeSignal(id);
      toast({
        title: "Signal Closed",
        description: "Trading signal has been successfully closed.",
      });
      fetchSignals();
    } catch (error) {
      console.error("Failed to close signal:", error);
      toast({
        variant: "destructive",
        title: "Failed to Close Signal",
        description: "Unable to close the signal. Please try again.",
      });
    }
  };

  useEffect(() => {
    if (session?.accessToken) {
      fetchSignals();
    }
  }, [session]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
    router.push('/');
    return null;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Manage Signals</h1>
      
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create Signal</TabsTrigger>
          <TabsTrigger value="active">Active Signals</TabsTrigger>
          <TabsTrigger value="history">Signal History</TabsTrigger>
        </TabsList>
        
                 <TabsContent value="create" className="mt-6">
           <Card>
             <CardHeader>
               <CardTitle>Create New Signal</CardTitle>
             </CardHeader>
             <CardContent>
               <CreateSignalForm onSignalCreated={fetchSignals} />
             </CardContent>
           </Card>
         </TabsContent>
        
        <TabsContent value="active" className="mt-6">
          <ActiveSignals signals={activeSignals} onCloseSignal={handleCloseSignal} />
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <SignalHistory signals={signalHistory} />
        </TabsContent>
      </Tabs>
    </div>
  );
} 