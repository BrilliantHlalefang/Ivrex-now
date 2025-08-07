import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { API_BASE_URL } from '@/lib/api';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const endpoint = url.pathname.replace('/api/challenges', '/challenges');
    
    const backendResponse = await fetch(`${API_BASE_URL}${endpoint}${url.search}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    const responseData = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json({ message: responseData.message || 'An error occurred.' }, { status: backendResponse.status });
    }

    return NextResponse.json(responseData, { status: backendResponse.status });

  } catch (error) {
    console.error('Error in challenges API route:', error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    
    const backendResponse = await fetch(`${API_BASE_URL}/challenges`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: formData,
    });

    const responseData = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json({ message: responseData.message || 'An error occurred.' }, { status: backendResponse.status });
    }

    return NextResponse.json(responseData, { status: backendResponse.status });

  } catch (error) {
    console.error('Error in challenges API route:', error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
} 