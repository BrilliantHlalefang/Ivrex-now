"use client";

import { useState, useEffect } from 'react';
import { User } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';

interface EditUserDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdate: (updatedUser: User) => void;
}

const ALL_RESPONSIBILITIES = ['mpesa', 'ecocash'];

export function EditUserDialog({ user, isOpen, onClose, onUserUpdate }: EditUserDialogProps) {
  const [role, setRole] = useState(user?.role || 'user');
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setRole(user.role || 'user');
      setResponsibilities(user.verificationResponsibilities || []);
    }
  }, [user]);

  if (!user) {
    return null;
  }
  
  const handleResponsibilityChange = (responsibility: string) => {
    setResponsibilities(prev => 
      prev.includes(responsibility) 
        ? prev.filter(r => r !== responsibility)
        : [...prev, responsibility]
    );
  };

  const handleSaveChanges = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role,
          verificationResponsibilities: responsibilities,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update user.');
      }

      const updatedUser = await res.json();
      onUserUpdate(updatedUser);
      toast({
        title: "User Updated",
        description: `${user.profile ? user.profile.firstName : user.email}'s permissions have been updated.`,
      });
      onClose();

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User: {user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : user.email}</DialogTitle>
          <DialogDescription>
            Modify the user's role and verification responsibilities.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Responsibilities
            </Label>
            <div className="col-span-3 space-y-2">
              {ALL_RESPONSIBILITIES.map((resp) => (
                <div key={resp} className="flex items-center space-x-2">
                  <Checkbox
                    id={`resp-${resp}`}
                    checked={responsibilities.includes(resp)}
                    onCheckedChange={() => handleResponsibilityChange(resp)}
                  />
                  <Label htmlFor={`resp-${resp}`} className="capitalize">{resp}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 