import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { API_BASE_URL } from '@/lib/api';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { challengeId, subscriptionId } = await request.json();

    if (!challengeId || !subscriptionId) {
      return NextResponse.json({ message: 'Challenge ID and Subscription ID are required' }, { status: 400 });
    }

    // Forward the request to the backend
    const backendResponse = await fetch(`${API_BASE_URL}/challenges/${challengeId}/link-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({ subscriptionId }),
    });

    const responseData = await backendResponse.json();

    if (!backendResponse.ok) {
      console.error("Backend error:", responseData);
      return NextResponse.json({ message: responseData.message || 'An error occurred.' }, { status: backendResponse.status });
    }

    return NextResponse.json(responseData, { status: backendResponse.status });

  } catch (error) {
    console.error('Error in challenge link API route:', error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
} 