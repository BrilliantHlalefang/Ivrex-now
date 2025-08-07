'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createSignal } from '@/lib/api';
import { SignalType } from '@/types';

interface CreateSignalFormProps {
  onSignalCreated?: () => void;
}

const formSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required'),
  entry_price: z.coerce.number().positive('Entry price must be positive'),
  stop_loss: z.coerce.number().positive('Stop loss must be positive'),
  take_profit: z.coerce.number().positive('Take profit must be positive'),
  type: z.nativeEnum(SignalType),
});

export default function CreateSignalForm({ onSignalCreated }: CreateSignalFormProps = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: '',
      entry_price: 0,
      stop_loss: 0,
      take_profit: 0,
      type: SignalType.BUY,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await createSignal(values);
      form.reset();
      setSuccess(`Signal created successfully! ${values.symbol} ${values.type.toUpperCase()} signal is now live.`);
      setTimeout(() => setSuccess(null), 5000);
      
      // Trigger refresh in parent component
      if (onSignalCreated) {
        onSignalCreated();
      }
    } catch (err) {
      setError('Failed to create signal. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="symbol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Symbol</FormLabel>
              <FormControl>
                <Input placeholder="e.g., BTC/USD" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select signal type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={SignalType.BUY}>Buy</SelectItem>
                  <SelectItem value={SignalType.SELL}>Sell</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="entry_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Entry Price</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stop_loss"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stop Loss</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="take_profit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Take Profit</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        {success && (
          <div className="text-green-600 font-medium p-3 bg-green-50 border border-green-200 rounded-md">
            {success}
          </div>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Signal'}
        </Button>
      </form>
    </Form>
  );
} 