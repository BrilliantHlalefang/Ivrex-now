"use client";

import { useEffect, useState } from 'react';
import { fetcher } from '../../lib/api';
import { User } from '../../types';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        const data = await fetcher<User[]>('/users');
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;
  if (users.length === 0) return <p>No users found.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id} className="p-3 border rounded shadow-sm">
            <p className="font-semibold">{user.profile?.firstName} {user.profile?.lastName}</p>
            <p className="text-sm text-gray-600">ID: {user.id} | Active: {user.isActive ? 'Yes' : 'No'}</p>
            <p className="text-xs text-gray-500">Created: {new Date(user.createdAt).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
} 