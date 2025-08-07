import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { API_BASE_URL } from '@/lib/api';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  // @ts-ignore
  const isSuperAdmin = session?.user?.role === 'admin' && (!session?.user?.verificationResponsibilities || session?.user?.verificationResponsibilities.length === 0);

  if (!session?.accessToken || !isSuperAdmin) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const resolvedParams = await params;
    const userId = resolvedParams.id;
    const body = await request.json();

    const res = await fetch(`${API_BASE_URL}/users/${userId}/permissions`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ message: errorData.message || 'Failed to update user permissions' }, { status: res.status });
    }

    const updatedUser = await res.json();
    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error('Error updating user permissions:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
} 