import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { API_BASE_URL } from '@/lib/api';
import { SubscriptionType } from '@/types';

const getSubscriptionType = (serviceName: string): SubscriptionType => {
    const mapping: { [key: string]: SubscriptionType } = {
        "Trading Signals": SubscriptionType.TRADING_SIGNALS,
        "Copy Trading Access": SubscriptionType.COPY_TRADING,
        "Advanced Analytics": SubscriptionType.ADVANCED_ANALYTICS,
        "Personal Coaching": SubscriptionType.PERSONAL_COACHING,
        "IVREX Pro": SubscriptionType.IVREX_PRO,
    };
    return mapping[serviceName] || SubscriptionType.IVREX_PRO;
};

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const serviceName = formData.get('serviceName') as string;
    const price = formData.get('price') as string;

    // We need to transform the service name to the enum type for the backend
    formData.set('type', getSubscriptionType(serviceName));
    
    // Ensure price is a number. The DTO expects a number.
    // The ValidationPipe with multipart/form-data doesn't always transform it.
    // We remove the old price and append it again, which is simpler than `set`.
    if (price) {
        formData.delete('price');
        // @ts-ignore
        formData.append('price', parseFloat(price));
    }

    // The backend doesn't need serviceName, it uses 'type'
    formData.delete('serviceName');
    
    // Forward the request to the backend
    const backendResponse = await fetch(`${API_BASE_URL}/subscriptions`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${session.accessToken}`,
            // Multer will set the Content-Type with the boundary
        },
        body: formData,
    });

    const responseData = await backendResponse.json();

    if (!backendResponse.ok) {
        console.error("Backend error:", responseData);
        return NextResponse.json({ message: responseData.message || 'An error occurred.' }, { status: backendResponse.status });
    }

    return NextResponse.json(responseData, { status: backendResponse.status });

  } catch (error) {
    console.error('Error in subscription API route:', error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
} 